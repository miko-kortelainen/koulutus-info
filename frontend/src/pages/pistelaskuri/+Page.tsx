import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import PageContainer from "@/layout/PageContainer";
import type { ScoreResult } from "./+data";
import ScoreForm from "./components/ScoreForm";
import ScoreResultCard from "./components/ScoreResultCard";
import { SCORE_TYPES, type ScoreType } from "./scoreTypes";

const pageSize = 20;

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
        Katso suuntaa-antavasti, mihin koulutuksiin pisteesi olisivat riittäneet vuoden 2026 pisterajoilla.
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
          {SCORE_TYPES.find(({ value }) => value === search.selectionMethod)?.label}, enintään{" "}
          {scoreFormatter.format(search.score)} pistettä
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
        onSubmit={(selectionMethod, score) => {
          setSearch({ score, selectionMethod });
          setPage(1);
        }}
      />
      <Text color="fg.muted" fontSize="xs" textWrap="pretty">
        Pisterajat ovat suuntaa-antavia eivätkä takaa opiskelupaikkaa.
      </Text>
      {resultList}
    </PageContainer>
  );
}
