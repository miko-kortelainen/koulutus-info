import { Accordion, Heading, HStack, Separator, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { ScoreResult } from "./+data";
import ScoreForm from "./components/ScoreForm";
import ScoreResultCard from "./components/ScoreResultCard";
import SortControl, { type SortOption } from "./components/SortControl";
import { AMM_MAX_SCORE } from "./lib/ammScoring";
import { YO_MAX_SCORE } from "./lib/yoScoring";
import { SCORE_TYPES, type ScoreType } from "./scoreTypes";

const MAX_SCORE_BY_TYPE: Partial<Record<ScoreType, number>> = {
  "Todistusvalinta (AMM)": AMM_MAX_SCORE,
  "Todistusvalinta (YO)": YO_MAX_SCORE,
};

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

export default function ScoreCalculatorPage() {
  const results = useData<ScoreResult[]>();
  const [selectionMethod, setSelectionMethod] = useState<ScoreType>("Todistusvalinta (YO)");
  const [search, setSearch] = useState<Search | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOption>("lowest_cutoff");
  const maxScore = search ? MAX_SCORE_BY_TYPE[search.selectionMethod] : undefined;
  const groups = useMemo(() => {
    const byAla = new Map<string, ScoreResult[]>();
    for (const result of results) {
      if (result.selectionMethod !== selectionMethod) continue;
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
  }, [results, search, selectionMethod, sortOrder]);
  const totalCount = groups.reduce((sum, group) => sum + group.results.length, 0);
  const qualifiedCount = groups.reduce((sum, group) => sum + (group.qualifiedCount ?? 0), 0);
  const selectedScoreType = SCORE_TYPES.find(({ value }) => value === selectionMethod);

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

  const resultList = (
    <Stack gap={4}>
      <Stack aria-live="polite" gap={1}>
        <Heading as="h2" size="md">
          Pisteesi riittävät {search ? qualifiedCount : "–"} / {totalCount} koulutukseen
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {selectedScoreType?.label}:{" "}
          {search
            ? maxScore
              ? `${scoreFormatter.format(search.score)} / ${maxScore}`
              : `enintään ${scoreFormatter.format(search.score)} pistettä`
            : "pisteitä ei ole vielä laskettu"}{" "}
        </Text>
      </Stack>
      <SortControl onChange={setSortOrder} value={sortOrder} />
      <Accordion.Root collapsible lazyMount multiple>
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
                      userScore={search?.score}
                    />
                  ))}
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
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
