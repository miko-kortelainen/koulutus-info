import { Accordion, Alert, Box, Heading, HStack, Separator, Stack, Text } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { getCutoffSchools } from "@/api/api";
import { cutoffRoundLabel, cutoffRoundShortLabel } from "@/config/cutoffRounds";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { ScoreCalculatorPageData } from "./+data";
import ResultSelect from "./components/ResultSelect";
import ScoreForm from "./components/ScoreForm";
import ScoreResultCard from "./components/ScoreResultCard";
import { AMM_MAX_SCORE } from "./lib/ammScoring";
import { flattenScoreResults, type ScoreResult } from "./lib/scoreResults";
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
  { label: "Vain ammattikorkeakoulut", value: "amk" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Alin pisteraja", value: "lowest_cutoff" },
  { label: "Korkein pisteraja", value: "highest_cutoff" },
  { label: "A-Z", value: "name_asc" },
  { label: "Z-A", value: "name_desc" },
];

interface Search {
  score: number;
  selectionMethod: ScoreType;
}

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
  const [search, setSearch] = useState<Search | null>(null);
  const [round, setRound] = useState(initialRound);
  const [sectorFilter, setSectorFilter] = useState<SectorFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOption>("lowest_cutoff");
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const cutoffQuery = useQuery({
    queryKey: ["cutoff-results", round],
    queryFn: async () => flattenScoreResults(await getCutoffSchools(round)),
    initialData: round === initialRound ? initialResults : undefined,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
  const results = cutoffQuery.data ?? [];
  const maxScore = search ? MAX_SCORE_BY_TYPE[search.selectionMethod] : undefined;
  const groups = useMemo(() => {
    const byAla = new Map<string, ScoreResult[]>();
    for (const result of results) {
      if (result.selectionMethod !== selectionMethod || !matchesSector(result, sectorFilter)) continue;
      const group = byAla.get(result.koulutusala) ?? [];
      group.push(result);
      byAla.set(result.koulutusala, group);
    }

    return [...byAla.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "fi"))
      .map(([koulutusala, alaResults]) => ({
        koulutusala,
        results: alaResults.sort((a, b) => compareResults(a, b, sortOrder)),
        qualifiedCount: search ? alaResults.filter((result) => result.score <= search.score).length : undefined,
      }));
  }, [results, search, sectorFilter, selectionMethod, sortOrder]);
  const totalCount = groups.reduce((sum, group) => sum + group.results.length, 0);
  const qualifiedCount = groups.reduce((sum, group) => sum + (group.qualifiedCount ?? 0), 0);
  const roundLabel = cutoffRoundShortLabel(round);
  const displayedQualifiedCount = cutoffQuery.isSuccess && search ? qualifiedCount : "–";
  const displayedTotalCount = cutoffQuery.isSuccess ? totalCount : "–";

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Pistelaskuri
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Laske todistusvalintapisteesi ylioppilastutkinnon tai ammattillisen perustutkinnon todistuksen perusteella.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const resultAccordion = (
    <Accordion.Root
      collapsible
      lazyMount
      multiple
      onValueChange={(details) => setOpenGroups(details.value)}
      size="md"
      value={openGroups}
    >
      {groups.map((group) => (
        <Accordion.Item key={group.koulutusala} value={group.koulutusala}>
          <Accordion.ItemTrigger>
            <HStack gap={0} width="100%">
              <Heading as="h3" flex={{ base: 4.5, md: 10 }} size="xs" textAlign="start">
                {group.koulutusala}
              </Heading>

              <HStack flex={1} justifyContent="space-between">
                <Text
                  color={(group.qualifiedCount ?? 0) > 0 ? COLORS.accent : COLORS.text}
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
          <Accordion.ItemContent>
            <Accordion.ItemBody maxH="60vh" overflowY="auto">
              <Stack gap={4}>
                {group.results.map((result) => (
                  <ScoreResultCard
                    key={`${result.schoolName}::${result.programmeName}::${result.selectionMethod}`}
                    result={result}
                    roundLabel={roundLabel}
                    userScore={search?.score}
                  />
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );

  const resultContent = cutoffQuery.isPending ? (
    <Text role="status">Pisterajoja ladataan…</Text>
  ) : cutoffQuery.isError ? (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Pisterajojen lataaminen epäonnistui.</Alert.Title>
    </Alert.Root>
  ) : groups.length === 0 ? (
    <Text>Ei koulutuksia valituilla rajauksilla.</Text>
  ) : (
    resultAccordion
  );

  const resultList = (
    <Stack aria-busy={cutoffQuery.isPending} gap={4}>
      <Stack aria-live="polite" gap={1}>
        <Box border={`1px solid ${COLORS.accent}`} borderRadius={8} p={4}>
          <Heading as="h2" size="lg" textAlign="center">
            {search ? (
              maxScore ? (
                <>
                  <Text as="span" color={COLORS.accent}>
                    {scoreFormatter.format(search.score)}
                  </Text>{" "}
                  /{" "}
                  <Text as="span" color="fg.muted">
                    {maxScore}
                  </Text>{" "}
                  pistettä
                </>
              ) : (
                <>
                  <Text as="span" color={COLORS.accent}>
                    {scoreFormatter.format(search.score)}
                  </Text>{" "}
                  pistettä
                </>
              )
            ) : (
              "Ei vielä laskettu"
            )}{" "}
          </Heading>
          <Text color="fg.muted" fontSize="xs" textAlign="center">
            Pisteesi riittävät {displayedQualifiedCount} / {displayedTotalCount} koulutukseen
          </Text>
        </Box>
      </Stack>
      <Stack direction={{ base: "column", lg: "row" }} gap={4} width="full">
        <HStack flex={1} gap={4}>
          <ResultSelect
            items={rounds.map((value) => ({ label: cutoffRoundLabel(value), value }))}
            label="Yhteishaku"
            onChange={setRound}
            value={round}
          />

          <ResultSelect
            items={SECTOR_OPTIONS}
            label="Korkeakoulutyyppi"
            onChange={setSectorFilter}
            value={sectorFilter}
          />
        </HStack>
        <Box flex={1}>
          <ResultSelect
            ariaLabel="Järjestys"
            items={SORT_OPTIONS}
            label="Järjestysperuste"
            onChange={setSortOrder}
            value={sortOrder}
          />
        </Box>
      </Stack>
      {resultContent}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      <ScoreForm
        onModeChange={(nextSelectionMethod) => {
          setSelectionMethod(nextSelectionMethod);
          setSearch(null);
        }}
        onSubmit={(selectionMethod, score) => {
          setSearch({ score, selectionMethod });
        }}
      />

      {resultList}
      <Text color="fg.muted" fontSize="xs" textWrap="pretty">
        Huom. Pisterajat ovat suuntaa-antavia. Vertailu ei ota huomioon hakukohdekohtaisia kynnysehtoja. <br />
        <br />
        Pisterajojen tiedot ovat peräisin virallisen opetushallituksen Vipunen.fi- palvelusta.
      </Text>
    </PageContainer>
  );
}
