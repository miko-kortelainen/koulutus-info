import { Accordion, Alert, Box, Checkbox, Heading, HStack, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { getCutoffSchools } from "@/api/api";
import SearchInput from "@/components/SearchInput";
import { cutoffRoundLabel, cutoffRoundShortLabel } from "@/config/cutoffRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { ScoreCalculatorPageData } from "./+data";
import ResultSelect from "./components/ResultSelect";
import ScoreForm from "./components/ScoreForm";
import ScoreResultList from "./components/ScoreResultList";
import { AMM_MAX_SCORE } from "./lib/ammScoring";
import { flattenScoreResults, type ScoreResult, selectApplicantResults } from "./lib/scoreResults";
import { YO_MAX_SCORE } from "./lib/yoScoring";
import type { ScoreType } from "./scoreTypes";

const MAX_SCORE_BY_TYPE: Partial<Record<ScoreType, number>> = {
  "Todistusvalinta (AMM)": AMM_MAX_SCORE,
  "Todistusvalinta (YO)": YO_MAX_SCORE,
};

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

interface Calculation {
  score: number;
  selectionMethod: ScoreType;
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

export default function ScoreCalculatorPage() {
  const { initialResults, initialRound, rounds } = useData<ScoreCalculatorPageData>();
  const [selectionMethod, setSelectionMethod] = useState<ScoreType>("Todistusvalinta (YO)");
  const [isFirstTimeApplicant, setIsFirstTimeApplicant] = useState(false);
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [round, setRound] = useState(initialRound);
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOption>("lowest_cutoff");
  const cutoffQuery = useQuery({
    queryKey: ["cutoff-results", round],
    queryFn: async () => flattenScoreResults(await getCutoffSchools(round)),
    initialData: round === initialRound ? initialResults : undefined,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
  const results = cutoffQuery.data ?? [];
  const maxScore = calculation ? MAX_SCORE_BY_TYPE[calculation.selectionMethod] : undefined;
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
        qualifiedCount: calculation
          ? alaResults.filter((result) => result.score <= calculation.score).length
          : undefined,
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
  const qualifiedCount = calculation ? filteredResults.filter((result) => result.score <= calculation.score).length : 0;
  const roundLabel = cutoffRoundShortLabel(round);
  const resultListKey = [round, selectionMethod, isFirstTimeApplicant, sectorFilter, sortOrder].join(":");
  const displayedQualifiedCount = cutoffQuery.isSuccess && calculation ? qualifiedCount : "–";
  const displayedTotalCount = cutoffQuery.isSuccess ? totalCount : "–";

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Pistelaskuri
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Laske todistusvalintapisteesi ylioppilastutkinnon tai ammatillisen perustutkinnon todistuksen perusteella.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const resultAccordion = (
    <Accordion.Root collapsible lazyMount multiple size="md">
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
                    fontSize="xs"
                    textDecor={(group.qualifiedCount ?? 0) > 0 ? "underline" : ""}
                  >
                    {group.qualifiedCount ?? "–"}
                  </Text>
                  <Text color="fg.muted" fontSize="xs" textWrap="nowrap">
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
                userScore={calculation?.score}
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
          userScore={calculation?.score}
        />
      </Stack>
    );

  const resultContent = cutoffQuery.isPending ? (
    <Text role="status">Pisterajoja ladataan…</Text>
  ) : cutoffQuery.isError ? (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Pisterajojen lataaminen epäonnistui.</Alert.Title>
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
    <Stack aria-busy={cutoffQuery.isPending} gap={4} mt={{ base: 6, md: 10 }}>
      <Stack aria-live="polite" gap={1}>
        <Box border={`1px solid ${COLORS.accentFg}`} borderRadius={8} mb={{ base: 6, md: 10 }} p={4}>
          <Heading as="h2" size="lg" textAlign="center">
            {calculation ? (
              maxScore ? (
                <>
                  <Text as="span" color="fg.accent">
                    {scoreFormatter.format(calculation.score)}
                  </Text>{" "}
                  /{" "}
                  <Text as="span" color="fg.muted">
                    {maxScore}
                  </Text>{" "}
                  pistettä
                </>
              ) : (
                <>
                  <Text as="span" color="fg.accent">
                    {scoreFormatter.format(calculation.score)}
                  </Text>{" "}
                  pistettä
                </>
              )
            ) : (
              "Ei vielä laskettu"
            )}{" "}
          </Heading>
          <Text color="fg.muted" fontSize="xs" textAlign="center">
            Pisteesi riittävät {displayedQualifiedCount} / {displayedTotalCount} toteutukseen
          </Text>
        </Box>
      </Stack>

      <HStack>
        <Separator bg={COLORS.accentFg} flex={1} size="md" />
        <Text fontSize="sm" fontWeight="semibold" letterSpacing="wide" textAlign="center">
          Vertaa pisterajoihin
        </Text>
        <Separator bg={COLORS.accentFg} flex={1} size="md" />
      </HStack>

      <Stack direction={{ base: "column", lg: "row" }} gap={4} width="full">
        <HStack flex={1} gap={6}>
          <Box flex={6}>
            <ResultSelect<typeof round>
              items={rounds.map((value) => ({ label: cutoffRoundLabel(value), value }))}
              label="Yhteishaku"
              onChange={setRound}
              value={round}
            />
          </Box>

          <Box flex={4}>
            <ResultSelect<SectorFilter>
              items={SECTOR_OPTIONS}
              label="Korkeakoulutyyppi"
              onChange={setSectorFilter}
              value={sectorFilter}
            />
          </Box>
        </HStack>
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
    <PageContainer align="flex-start">
      {header}

      <ScoreForm
        onModeChange={(nextSelectionMethod) => {
          setSelectionMethod(nextSelectionMethod);
          setCalculation(null);
        }}
        onSubmit={(selectionMethod, score) => {
          setCalculation({ score, selectionMethod });
        }}
      />

      {resultList}

      <Text color="fg.muted" fontSize="xs" lineHeight="tall" mt={2} textWrap="pretty">
        Huom. Vaikka pisteesi ylittää mainitut pisterajat, koulutuspaikka ei ole taattu. Pisterajat vaihtelee vuosi
        vuodelta. <br /> Vertailu ei ota huomioon hakukohdekohtaisia kynnysehtoja. Voit tutustua yliopistojen
        todistusvalinnan kynnysehtoihin{" "}
        <Link href="/oppaat/yliopistojen-todistusvalinta/" textDecoration="underline">
          täältä
        </Link>
        . <br /> <br />
        Pisterajojen tiedot ovat peräisin Opetushallituksen Vipunen-palvelusta.
      </Text>
    </PageContainer>
  );
}
