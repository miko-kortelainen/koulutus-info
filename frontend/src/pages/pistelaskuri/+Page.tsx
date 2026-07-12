import { Accordion, Badge, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import PageContainer from "@/layout/PageContainer";
import type { ScoreResult } from "./+data";
import ScoreForm from "./components/ScoreForm";
import ScoreResultCard from "./components/ScoreResultCard";
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

export default function ScoreCalculatorPage() {
  const results = useData<ScoreResult[]>();
  const [search, setSearch] = useState<Search | null>(null);
  const maxScore = search ? MAX_SCORE_BY_TYPE[search.selectionMethod] : undefined;
  const groups = useMemo(() => {
    if (!search) return [];

    const byAla = new Map<string, ScoreResult[]>();
    for (const result of results) {
      if (result.selectionMethod !== search.selectionMethod) continue;
      const group = byAla.get(result.koulutusala) ?? [];
      group.push(result);
      byAla.set(result.koulutusala, group);
    }

    return [...byAla.entries()]
      .sort(([a], [b]) => a.localeCompare(b, "fi"))
      .map(([koulutusala, alaResults]) => ({
        koulutusala,
        results: alaResults.sort((a, b) => a.score - b.score || a.programmeName.localeCompare(b.programmeName, "fi")),
        qualifiedCount: alaResults.filter((result) => result.score <= search.score).length,
      }));
  }, [results, search]);
  const totalCount = groups.reduce((sum, group) => sum + group.results.length, 0);
  const qualifiedCount = groups.reduce((sum, group) => sum + group.qualifiedCount, 0);

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Pistelaskuri
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Laske ylioppilastutkinnon tai ammatillisen perustutkinnon todistuspisteet vuoden 2026 virallisella mallilla ja
        vertaa tulosta saman vuoden pisterajoihin.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const resultList = search ? (
    <Stack gap={4}>
      <Stack aria-live="polite" gap={1}>
        <Heading as="h2" size="md">
          Pisteesi riittävät {qualifiedCount} / {totalCount} koulutukseen
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {SCORE_TYPES.find(({ value }) => value === search.selectionMethod)?.label},{" "}
          {maxScore
            ? `${scoreFormatter.format(search.score)} / ${maxScore}`
            : `enintään ${scoreFormatter.format(search.score)} pistettä`}
        </Text>
      </Stack>
      <Accordion.Root collapsible lazyMount multiple>
        {groups.map((group) => (
          <Accordion.Item key={group.koulutusala} value={group.koulutusala}>
            <Accordion.ItemTrigger>
              <Heading as="h3" flex="1" size="sm" textAlign="start">
                {group.koulutusala}
              </Heading>
              <Badge borderRadius="full" colorPalette={group.qualifiedCount > 0 ? "green" : "gray"}>
                {group.qualifiedCount}
              </Badge>
              <Text color="fg.muted" fontSize="sm">
                / {group.results.length}
              </Text>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody maxH="60vh" overflowY="auto">
                <Stack gap={4}>
                  {group.results.map((result) => (
                    <ScoreResultCard
                      key={`${result.schoolName}::${result.programmeName}::${result.selectionMethod}`}
                      result={result}
                      userScore={search.score}
                    />
                  ))}
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Stack>
  ) : null;

  return (
    <PageContainer align="flex-start">
      {header}
      <ScoreForm
        onModeChange={() => setSearch(null)}
        onSubmit={(selectionMethod, score) => {
          setSearch({ score, selectionMethod });
        }}
      />
      <Text color="fg.muted" fontSize="xs" textWrap="pretty">
        Pisterajat ovat suuntaa-antavia. Vertailu ei huomioi hakukohdekohtaisia vähimmäispisteitä tai kynnysehtoja eikä
        takaa opiskelupaikkaa.
      </Text>
      {resultList}
    </PageContainer>
  );
}
