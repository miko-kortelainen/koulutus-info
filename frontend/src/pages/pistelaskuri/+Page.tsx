import { Accordion, Alert, Box, Checkbox, Heading, HStack, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useWebMCP } from "use-webmcp-tool";
import SearchInput from "@/components/SearchInput";
import {
  CALCULATOR_CUTOFF_ROUNDS,
  type CutoffRound,
  cutoffRoundLabel,
  cutoffRoundShortLabel,
  DEFAULT_CUTOFF_ROUND,
} from "@/config/cutoffRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import {
  getAmkPrograms,
  getUniversityPrograms,
  recalculateFromGrades,
  type AmkProgramsResponse,
  type UniversityProgramsResponse,
} from "@/pages/pistelaskuri/lib/todistusvalinta/index";
import { COLORS } from "@/theme";
import {
  AMM_GRADES,
  type AmmFormState,
  type AmmGrade,
  parseAmmForm,
} from "@/pages/pistelaskuri/components/AmmForm";
import ResultSelect from "@/pages/pistelaskuri/components/ResultSelect";
import ScoreForm from "@/pages/pistelaskuri/components/ScoreForm";
import ScoreResultList from "@/pages/pistelaskuri/components/ScoreResultList";
import {
  type Calculation,
  flattenAmkPrograms,
  flattenUniversityPrograms,
  qualifies,
  type ScoreResult,
  selectApplicantResults,
  toCompactQualified,
} from "@/pages/pistelaskuri/lib/scoreResults";
import { SUBJECT_OPTIONS, parseYoForm, toUniversityGrades, yoFormFromExamGrades, type YoFormState } from "@/pages/pistelaskuri/lib/yoForm";
import { YO_GRADES, type YoGrade } from "@/pages/pistelaskuri/lib/yoScoring";
import type { ScoreType } from "@/pages/pistelaskuri/scoreTypes";

type SectorFilter = "all" | "university" | "amk";
type SortOption = "lowest_cutoff" | "highest_cutoff" | "name_asc" | "name_desc";

const SECTOR_OPTIONS: { label: string; value: SectorFilter }[] = [
  { label: "Kaikki korkeakoulut", value: "all" },
  { label: "Vain yliopistot", value: "university" },
  { label: "Vain AMK", value: "amk" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Alin pisteraja", value: "lowest_cutoff" },
  { label: "Korkein pisteraja", value: "highest_cutoff" },
  { label: "A-Ö", value: "name_asc" },
  { label: "Ö-A", value: "name_desc" },
];

const ROUND_OPTIONS = CALCULATOR_CUTOFF_ROUNDS.map((round) => ({
  label: cutoffRoundLabel(round),
  value: round,
}));

interface InitialPrograms {
  amkAmm: AmkProgramsResponse;
  amkYo: AmkProgramsResponse;
  university: UniversityProgramsResponse;
}

const FUSE_OPTIONS = {
  keys: [
    { name: "programmeName", weight: 2 },
    { name: "schoolName", weight: 1 },
    { name: "koulutusala", weight: 1 },
  ],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

function compareNames(a: ScoreResult, b: ScoreResult) {
  return a.programmeName.localeCompare(b.programmeName, "fi") || a.schoolName.localeCompare(b.schoolName, "fi");
}

function compareResults(a: ScoreResult, b: ScoreResult, sortOrder: SortOption) {
  switch (sortOrder) {
    case "highest_cutoff":
      return b.score - a.score || compareNames(a, b);
    case "name_asc":
      return compareNames(a, b) || a.score - b.score;
    case "name_desc":
      return compareNames(b, a) || a.score - b.score;
    case "lowest_cutoff":
      return a.score - b.score || compareNames(a, b);
  }
}

function matchesSector(result: ScoreResult, sectorFilter: SectorFilter) {
  if (sectorFilter === "university") return result.sector === "Yliopistokoulutus";
  if (sectorFilter === "amk") return result.sector === "Ammattikorkeakoulukoulutus";
  return true;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function isCutoffRound(value: unknown): value is CutoffRound {
  return typeof value === "string" && (CALCULATOR_CUTOFF_ROUNDS as readonly string[]).includes(value);
}

function parseYoAgentForm(args: Record<string, unknown>): YoFormState | string {
  if (!Array.isArray(args.aineet) || args.aineet.length === 0) {
    return "Anna vähintään yksi aine ja arvosana.";
  }
  const grades: Record<string, YoGrade> = {};
  for (const row of args.aineet) {
    if (!isRecord(row) || typeof row.aine !== "string" || typeof row.arvosana !== "string") {
      return "Jokaisella aineella tarvitaan aine-koodi ja arvosana.";
    }
    if (!SUBJECT_OPTIONS.some((option) => option.exam === row.aine)) {
      return `Tuntematon aine: ${row.aine}.`;
    }
    if (!(YO_GRADES as string[]).includes(row.arvosana)) {
      return `Virheellinen arvosana: ${row.arvosana}.`;
    }
    grades[row.aine] = row.arvosana as YoGrade;
  }
  return yoFormFromExamGrades(grades);
}

function parseAmmAgentForm(args: Record<string, unknown>): AmmFormState | string {
  const scale = args.asteikko === "1-3" || args.asteikko === "1-5" ? args.asteikko : null;
  if (!scale) return "Valitse asteikko 1-5 tai 1-3.";
  const grades = [args.viestinta, args.matemaattinen, args.yhteiskunta];
  if (!grades.every((grade): grade is AmmGrade => typeof grade === "number" && AMM_GRADES[scale].includes(grade as AmmGrade))) {
    return "Anna arvosana kaikille kolmelle osa-alueelle.";
  }
  const keskiarvoInput =
    typeof args.keskiarvo === "number"
      ? String(args.keskiarvo).replace(".", ",")
      : typeof args.keskiarvo === "string"
        ? args.keskiarvo
        : "";
  return { scale, grades: grades as [AmmGrade, AmmGrade, AmmGrade], keskiarvoInput };
}

async function getInitialPrograms(round: CutoffRound): Promise<InitialPrograms> {
  const [university, amkYo, amkAmm] = await Promise.all([
    getUniversityPrograms(round),
    getAmkPrograms("yo", round),
    getAmkPrograms("amm", round),
  ]);
  return { amkAmm, amkYo, university };
}

async function recalculateForRound(calculation: Calculation, round: CutoffRound): Promise<Calculation> {
  const { selectionMethod, yoGrades, ammGrades } = calculation;
  if (selectionMethod === "Todistusvalinta (YO)" && yoGrades) {
    return { ...calculation, ...(await recalculateFromGrades({ selectionMethod, yoGrades }, round)) };
  }
  if (selectionMethod === "Todistusvalinta (AMM)" && ammGrades) {
    return {
      ...calculation,
      ...(await recalculateFromGrades({ selectionMethod, ammGrades }, round)),
      university: undefined,
    };
  }
  return calculation;
}

export default function ScoreCalculatorPage() {
  const [selectionMethod, setSelectionMethod] = useState<ScoreType>("Todistusvalinta (YO)");
  const [cutoffRound, setCutoffRound] = useState<CutoffRound>(DEFAULT_CUTOFF_ROUND);
  const [isFirstTimeApplicant, setIsFirstTimeApplicant] = useState(true);
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [appliedForm, setAppliedForm] = useState<{ mode: ScoreType; yo?: YoFormState; amm?: AmmFormState }>();
  const [isRejoining, setIsRejoining] = useState(false);
  const [rejoinError, setRejoinError] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOption>("lowest_cutoff");
  const programsQuery = useQuery({
    queryKey: ["calculator-programs", cutoffRound],
    queryFn: () => getInitialPrograms(cutoffRound),
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
  const university = calculation?.university ?? programsQuery.data?.university;
  const amk =
    calculation?.amk ??
    (selectionMethod === "Todistusvalinta (YO)" ? programsQuery.data?.amkYo : programsQuery.data?.amkAmm);
  const results = useMemo(
    () => [...(university ? flattenUniversityPrograms(university) : []), ...(amk ? flattenAmkPrograms(amk) : [])],
    [amk, university],
  );
  const filteredResults = useMemo(
    () =>
      selectApplicantResults(results, selectionMethod, isFirstTimeApplicant)
        .filter((result) => matchesSector(result, sectorFilter))
        .sort((a, b) => compareResults(a, b, sortOrder)),
    [isFirstTimeApplicant, results, sectorFilter, selectionMethod, sortOrder],
  );
  const groups = useMemo(() => {
    const byAla = new Map<string, ScoreResult[]>();
    for (const result of filteredResults) {
      const group = byAla.get(result.koulutusala) ?? [];
      group.push(result);
      byAla.set(result.koulutusala, group);
    }

    return [...byAla.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "fi"))
      .map(([koulutusala, alaResults]) => ({
        koulutusala,
        results: alaResults,
        qualifiedCount: calculation ? alaResults.filter(qualifies).length : undefined,
      }));
  }, [calculation, filteredResults]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const normalizedSearchTerm = debouncedSearchTerm.trim();
  const resultFuse = useMemo(() => new Fuse(filteredResults, FUSE_OPTIONS), [filteredResults]);
  const searchResults = useMemo(() => {
    if (!normalizedSearchTerm) return [];

    const matchingIds = new Set(resultFuse.search(normalizedSearchTerm).map(({ item }) => item.id));
    return filteredResults.filter((result) => matchingIds.has(result.id));
  }, [filteredResults, normalizedSearchTerm, resultFuse]);
  const totalCount = filteredResults.length;
  const qualifiedCount = calculation ? filteredResults.filter(qualifies).length : 0;
  const resultsPending = (!calculation && programsQuery.isPending) || isRejoining;
  const resultsError = (!calculation && programsQuery.isError) || Boolean(rejoinError);
  const resultsSuccess = Boolean(calculation) || programsQuery.isSuccess;
  const roundLabel = cutoffRoundShortLabel(cutoffRound);
  const resultListKey = [cutoffRound, selectionMethod, isFirstTimeApplicant, sectorFilter, sortOrder].join(":");
  const displayedQualifiedCount = resultsSuccess && calculation ? qualifiedCount : "–";
  const displayedTotalCount = resultsSuccess ? totalCount : "–";

  useWebMCP({
    name: "calculate_todistuspisteet",
    description:
      "Laskee todistusvalintapisteet ylioppilastutkinnosta (yo) tai ammatillisesta perustutkinnosta (amm), täyttää pistelaskurin ja palauttaa koulutukset joihin pisteet riittävät.",
    inputSchema: {
      type: "object",
      properties: {
        valintatapa: { type: "string", enum: ["yo", "amm"], description: "YO-todistus tai ammatillinen perustutkinto." },
        aineet: {
          type: "array",
          description: "YO-aineet koodeina, esimerkiksi ai_fi, maa, fy, ena.",
          items: {
            type: "object",
            properties: {
              aine: { type: "string", description: "YO-koodi, esimerkiksi ai_fi, maa, fy." },
              arvosana: { type: "string", enum: YO_GRADES, description: "L, E, M, C, B tai A." },
            },
            required: ["aine", "arvosana"],
          },
        },
        asteikko: { type: "string", enum: ["1-5", "1-3"], description: "AMM-arvosana-asteikko." },
        viestinta: { type: "number", description: "Viestintä- ja vuorovaikutusosaaminen." },
        matemaattinen: { type: "number", description: "Matemaattis-luonnontieteellinen osaaminen." },
        yhteiskunta: { type: "number", description: "Yhteiskunta- ja työelämäosaaminen." },
        keskiarvo: { description: "Painotettu keskiarvo, myös 3,5." },
        kierros: { type: "string", enum: [...CALCULATOR_CUTOFF_ROUNDS], description: "Pisterajakierros, esimerkiksi 2026-kevat." },
        ensikertalainen: { type: "boolean", description: "Onko hakija ensikertalainen." },
      },
      required: ["valintatapa"],
    },
    execute: async (args: unknown) => {
      if (!isRecord(args) || (args.valintatapa !== "yo" && args.valintatapa !== "amm")) {
        return "Valitse valintatapa yo tai amm.";
      }
      const round = isCutoffRound(args.kierros) ? args.kierros : cutoffRound;
      const ensikertalainen = typeof args.ensikertalainen === "boolean" ? args.ensikertalainen : isFirstTimeApplicant;

      if (args.valintatapa === "yo") {
        const yo = parseYoAgentForm(args);
        if (typeof yo === "string") return yo;
        const parsed = parseYoForm(yo);
        if (!("input" in parsed)) return parsed.errors.aineet ?? "YO-todistus on puutteellinen.";
        const yoGrades = toUniversityGrades(yo);
        const selectionMethod = "Todistusvalinta (YO)" as const;
        const scored = await recalculateFromGrades({ selectionMethod, yoGrades }, round);
        const next: Calculation = { ...scored, selectionMethod, yoGrades };
        setCutoffRound(round);
        setIsFirstTimeApplicant(ensikertalainen);
        setSelectionMethod(selectionMethod);
        setAppliedForm({ mode: selectionMethod, yo });
        setCalculation(next);
        return {
          valintatapa: selectionMethod,
          pisteet: next.amk.score,
          enintaan: next.amk.maximumScore,
          kierros: round,
          ...toCompactQualified(
            selectApplicantResults(
              [...(next.university ? flattenUniversityPrograms(next.university) : []), ...flattenAmkPrograms(next.amk)],
              selectionMethod,
              ensikertalainen,
            ),
          ),
        };
      }

      const amm = parseAmmAgentForm(args);
      if (typeof amm === "string") return amm;
      const parsed = parseAmmForm(amm);
      if (!("input" in parsed)) return parsed.errors.grades ?? parsed.errors.keskiarvo ?? "AMM-todistus on puutteellinen.";
      const selectionMethod = "Todistusvalinta (AMM)" as const;
      const scored = await recalculateFromGrades({ selectionMethod, ammGrades: parsed.input }, round);
      const next: Calculation = { ...scored, selectionMethod, ammGrades: parsed.input, university: undefined };
      setCutoffRound(round);
      setIsFirstTimeApplicant(ensikertalainen);
      setSelectionMethod(selectionMethod);
      setAppliedForm({ mode: selectionMethod, amm });
      setCalculation(next);
      return {
        valintatapa: selectionMethod,
        pisteet: next.amk.score,
        enintaan: next.amk.maximumScore,
        kierros: round,
        ...toCompactQualified(selectApplicantResults(flattenAmkPrograms(next.amk), selectionMethod, ensikertalainen)),
      };
    },
  });

  const handleRoundChange = async (round: CutoffRound) => {
    if (round === cutoffRound) return;
    setCutoffRound(round);
    setRejoinError(undefined);
    if (!calculation) return;
    setIsRejoining(true);
    try {
      setCalculation(await recalculateForRound(calculation, round));
    } catch (error) {
      setRejoinError(error instanceof Error ? error.message : "Pisterajojen vaihtaminen epäonnistui.");
    } finally {
      setIsRejoining(false);
    }
  };

  const resultAccordion = (
    <Accordion.Root collapsible display="flex" flexDirection="column" gap={3} lazyMount multiple size="md">
      {groups.map((group) => (
        <Accordion.Item key={group.koulutusala} value={group.koulutusala}>
          <Heading as="h3" size="xs">
            <Accordion.ItemTrigger>
              <HStack gap={0} width="100%">
                <Text flex={{ base: 4.5, md: 10 }} fontWeight="semibold" textAlign="start">
                  {group.koulutusala}
                </Text>

                <HStack flex={1} justifyContent="space-between">
                  <Text
                    color={(group.qualifiedCount ?? 0) > 0 ? "fg.accent" : "fg"}
                    fontSize="sm"
                    textDecor={(group.qualifiedCount ?? 0) > 0 ? "underline" : ""}
                  >
                    {group.qualifiedCount ?? "–"}
                  </Text>
                  <Text color="fg.muted" fontSize="sm" textWrap="nowrap">
                    / {group.results.length}
                  </Text>
                </HStack>
              </HStack>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent>
            <Accordion.ItemBody aria-label={group.koulutusala} maxH="60vh" overflowY="auto" role="region">
              <ScoreResultList
                headingLevel="h4"
                key={`${resultListKey}:${group.koulutusala}`}
                results={group.results}
                roundLabel={roundLabel}
              />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );

  const searchResultContent =
    searchResults.length === 0 ? (
      <Text color="fg.muted" fontSize="sm" textAlign="center">
        Ei tuloksia hakusanalla "{normalizedSearchTerm}".
      </Text>
    ) : (
      <Stack gap={2}>
        <Text aria-live="polite" color="fg.muted" fontSize="xs" mt={-3} textAlign="right">
          {searchResults.length} {searchResults.length === 1 ? "hakutulos" : "hakutulosta"}
        </Text>
        <ScoreResultList
          key={`${resultListKey}:${normalizedSearchTerm}`}
          results={searchResults}
          roundLabel={roundLabel}
          showKoulutusala
        />
      </Stack>
    );

  const resultContent = resultsPending ? (
    <Text role="status">Pisterajoja ladataan…</Text>
  ) : resultsError ? (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>{rejoinError ?? "Hakukohteiden lataaminen epäonnistui."}</Alert.Title>
    </Alert.Root>
  ) : filteredResults.length === 0 ? (
    <Text color="fg.muted" fontSize="sm" textAlign="center">
      Ei toteutuksia valituilla rajauksilla :(
    </Text>
  ) : normalizedSearchTerm ? (
    searchResultContent
  ) : (
    resultAccordion
  );

  const resultList = (
    <Stack aria-busy={resultsPending} gap={4} mt={{ base: 6, md: 10 }}>
      <Stack aria-live="polite" gap={1}>
        <Box border={`1px solid ${COLORS.accentFg}`} borderRadius={8} mb={{ base: 6, md: 10 }} p={4}>
          <Heading as="h2" size="lg" textAlign="center">
            {calculation?.amk.score !== undefined ? (
              <>
                <Text as="span" color="fg.accent">
                  {calculation.selectionMethod === "Todistusvalinta (YO)" ? "~" : null}
                  {scoreFormatter.format(calculation.amk.score)}
                </Text>{" "}
                /{" "}
                <Text as="span" color="fg.muted">
                  {scoreFormatter.format(calculation.amk.maximumScore)}
                </Text>{" "}
                pistettä
              </>
            ) : (
              "Ei vielä laskettu"
            )}{" "}
          </Heading>
          <Text color="fg.muted" fontSize="xs" textAlign="center">
            Pisteesi riittää arviolta {displayedQualifiedCount} / {displayedTotalCount} toteutukseen
          </Text>
        </Box>
      </Stack>

      <HStack id="vertaa-pisterajoihin">
        <Separator bg={COLORS.accentFg} flex={1} size="md" />
        <Text fontSize="sm" fontWeight="semibold" letterSpacing="wide" textAlign="center">
          Vertaa pisterajoihin
        </Text>
        <Separator bg={COLORS.accentFg} flex={1} size="md" />
      </HStack>

      <Stack direction={{ base: "column", lg: "row" }} gap={4} width="full">
        <Box flex={1}>
          <ResultSelect<CutoffRound>
            items={ROUND_OPTIONS}
            label="Yhteishaku"
            onChange={handleRoundChange}
            value={cutoffRound}
          />
        </Box>
        <Box flex={1}>
          <ResultSelect<SectorFilter>
            items={SECTOR_OPTIONS}
            label="Korkeakoulutyyppi"
            onChange={setSectorFilter}
            value={sectorFilter}
          />
        </Box>
        <Box flex={1}>
          <ResultSelect<SortOption>
            ariaLabel="Järjestys"
            items={SORT_OPTIONS}
            label="Järjestysperuste"
            onChange={setSortOrder}
            value={sortOrder}
          />
        </Box>
      </Stack>
      <SearchInput onChange={setSearchTerm} placeholder="Hae toteutusta tai korkeakoulua" value={searchTerm} />
      <Checkbox.Root
        checked={isFirstTimeApplicant}
        onCheckedChange={({ checked }) => setIsFirstTimeApplicant(checked === true)}
        size="sm"
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Olen ensikertalainen</Checkbox.Label>
      </Checkbox.Root>
      {resultContent}
    </Stack>
  );

  return (
    <>
      <PageIntro
        description="Laske todistusvalintapisteesi ylioppilastutkinnon tai ammatillisen perustutkinnon todistuksen perusteella."
        title={
          <>
            Todistusvalinta
            <wbr />
            laskuri {cutoffRound.slice(0, 4)}
          </>
        }
      />
      <PageContainer align="flex-start">
        <ScoreForm
          applied={appliedForm}
          onModeChange={(nextSelectionMethod) => {
            setSelectionMethod(nextSelectionMethod);
            setCalculation(null);
          }}
          onSubmit={(next) => {
            setCalculation(next);
            document.getElementById("vertaa-pisterajoihin")?.scrollIntoView({ behavior: "smooth" });
          }}
          round={cutoffRound}
        />

        {resultList}

        <Text color="fg.muted" fontSize="xs" lineHeight="tall" mt={2} textWrap="pretty">
          Huom. Pisteet lasketaan aina vuoden 2026 todistusvalinnan pisteytyksellä. Vertailu vanhempiin yhteishakuihin
          on suuntaa antava, koska pisterajat ja pisteytys voivat poiketa. Vaikka pisteesi ylittää mainitut pisterajat,
          koulutuspaikka ei ole taattu.
          <br />
          <br />
          Pisterajojen tiedot ovat peräisin Opetushallituksen{" "}
          <Link href="https://vipunen.fi/fi-fi/" rel="noopener noreferrer" target="_blank" textDecoration="underline">
            Vipunen-palvelusta
          </Link>
          .
        </Text>
        <Text color="fg.muted" fontSize="xs" mt={2} textWrap="pretty">
          Löysitkö virheen? Ilmoita siitä{" "}
          <Link href="/palaute/" textDecoration="underline">
            täällä
          </Link>
          .
        </Text>
      </PageContainer>
    </>
  );
}
