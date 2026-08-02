import { Accordion, Alert, Box, Checkbox, Heading, HStack, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
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
} from "./lib/todistusvalinta";
import { COLORS } from "@/theme";
import ResultSelect from "./components/ResultSelect";
import ScoreForm from "./components/ScoreForm";
import ScoreResultList from "./components/ScoreResultList";
import {
  type Calculation,
  flattenAmkPrograms,
  flattenUniversityPrograms,
  type ScoreResult,
  selectApplicantResults,
} from "./lib/scoreResults";
import type { ScoreType } from "./scoreTypes";

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

// kynnysehtoPassed is undefined when no threshold requirement exists (passes),
// false when a threshold exists and was not met (fails), or true when met (passes).
const qualifies = (result: ScoreResult) =>
  result.applicantScore !== undefined && result.score <= result.applicantScore && result.kynnysehtoPassed !== false;

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
  const [isFirstTimeApplicant, setIsFirstTimeApplicant] = useState(false);
  const [calculation, setCalculation] = useState<Calculation | null>(null);
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
            Pisteesi riittävät {displayedQualifiedCount} / {displayedTotalCount} toteutukseen
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
        <Checkbox.Label>Näytä myös ensikertalaisten pisterajat</Checkbox.Label>
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
