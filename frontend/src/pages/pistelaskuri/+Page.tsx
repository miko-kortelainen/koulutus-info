import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import PageContainer from "@/layout/PageContainer";
import type { ScoreResult } from "./+data";
import ScoreForm from "./components/ScoreForm";
import ScoreResultCard from "./components/ScoreResultCard";
import { AMM_MAX_SCORE } from "./lib/ammScoring";
import { YO_MAX_SCORE } from "./lib/yoScoring";
import { SCORE_TYPES, type ScoreType } from "./scoreTypes";

const pageSize = 20;

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
  const [page, setPage] = useState(1);
  const maxScore = search ? MAX_SCORE_BY_TYPE[search.selectionMethod] : undefined;
  const filteredResults = useMemo(() => {
    if (!search) return [];

    return results
      .filter((result) => result.selectionMethod === search.selectionMethod && result.score <= search.score)
      .sort((a, b) => b.score - a.score || a.programmeName.localeCompare(b.programmeName, "fi"));
  }, [results, search]);
  const visibleResults = filteredResults.slice((page - 1) * pageSize, page * pageSize);

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
          {filteredResults.length} {filteredResults.length === 1 ? "koulutus" : "koulutusta"}
        </Heading>
        <Text color="fg.muted" fontSize="sm">
          {SCORE_TYPES.find(({ value }) => value === search.selectionMethod)?.label},{" "}
          {maxScore
            ? `${scoreFormatter.format(search.score)} / ${maxScore}`
            : `enintään ${scoreFormatter.format(search.score)} pistettä`}
        </Text>
      </Stack>
      {filteredResults.length === 0 ? <Text>Näillä pisteillä ei löytynyt koulutuksia.</Text> : null}
      {visibleResults.map((result) => (
        <ScoreResultCard
          key={`${result.schoolName}::${result.programmeName}::${result.selectionMethod}`}
          result={result}
        />
      ))}
      {filteredResults.length > pageSize ? (
        <Pagination count={filteredResults.length} onPageChange={setPage} page={page} pageSize={pageSize} />
      ) : null}
    </Stack>
  ) : null;

  return (
    <PageContainer align="flex-start">
      {header}
      <ScoreForm
        onModeChange={() => setSearch(null)}
        onSubmit={(selectionMethod, score) => {
          setSearch({ score, selectionMethod });
          setPage(1);
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
