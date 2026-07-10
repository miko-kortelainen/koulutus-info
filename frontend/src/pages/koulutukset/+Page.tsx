import { Accordion, Alert, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { FilterItem, selectFilter, toCollection } from "@/components/FilterAccordion";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import type { SchoolsResponse } from "@/types.gen";
import SchoolCardSkeleton from "./components/SchoolCardSkeleton";
import useFilteredDegrees from "./hooks/useFilteredDegrees";
import useSchoolsQuery from "./hooks/useSchoolsQuery";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  amk: "Ammattikorkeakoulu",
  yo: "Yliopisto",
};

export default function SchoolsListPage() {
  const ssrData = useData<SchoolsResponse>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const query = useSchoolsQuery(ssrData);
  const toteutukset = useMemo(
    () => query.data?.flatMap((k) => k.toteutukset.map((t) => ({ ...t, koulutustyyppi: k.koulutustyyppi }))),
    [query.data],
  );
  const sektoriCollection = useMemo(
    () =>
      toCollection(
        query.data?.map((k) => k.koulutustyyppi),
        (s) => SEKTORI_LABELS[s] ?? s,
      ),
    [query.data],
  );
  const kuntaCollection = useMemo(() => toCollection(toteutukset?.flatMap((t) => t.kunnat)), [toteutukset]);
  const schoolCollection = useMemo(() => toCollection(toteutukset?.map((t) => t.oppilaitosNimi.fi)), [toteutukset]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredDegrees(
    toteutukset,
    debouncedSearchTerm,
    selectedSektorit,
    selectedKunnat,
    selectedSchools,
  );

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const schoolSkeletonList = Array.from({ length: 10 }).map((_, i) => <SchoolCardSkeleton key={i} />);

  const errorAlert = (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
    </Alert.Root>
  );

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Koulutukset
      </Heading>
      <Text color="fg.muted">Korkeakoulujen syksyn 2026 yhteishaussa olevat toteutukset.</Text>
      <Separator mt={2} />
    </Stack>
  );

  const sortControls = (
    <Stack position={{ md: "sticky" }} width={{ base: "100%", md: "80" }}>
      <SearchInput
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Etsi koulutuksia"
        value={searchTerm}
      />
      <Accordion.Root multiple>
        <FilterItem
          collection={sektoriCollection}
          label="Sektori"
          onChange={selectFilter(setSelectedSektorit, () => setPage(1))}
          selected={selectedSektorit}
          value="sektori"
        />
        <FilterItem
          collection={kuntaCollection}
          label="Kunta"
          onChange={selectFilter(setSelectedKunnat, () => setPage(1))}
          selected={selectedKunnat}
          value="kunta"
        />
        <FilterItem
          collection={schoolCollection}
          label="Koulu"
          onChange={selectFilter(setSelectedSchools, () => setPage(1))}
          selected={selectedSchools}
          value="koulu"
        />
      </Accordion.Root>
    </Stack>
  );

  const cardList = (
    <Stack
      direction="column"
      gap={4}
      opacity={query.isPending ? 1 : query.isFetching ? 0.5 : 1}
      transition="opacity 0.15s"
    >
      {query.isPending ? schoolSkeletonList : null}
      {query.isError ? errorAlert : null}
      {!query.isPending && !query.isError && paginated.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
      {paginated.map((t, index) => (
        <SchoolCard key={`${t.toteutusOid} ${t.toteutusNimi} ${index}`} toteutus={t} />
      ))}
    </Stack>
  );

  return (
    <PageContainer>
      {header}

      <Stack align="start" direction={{ base: "column", md: "row" }} gap={4}>
        {sortControls}

        <Stack flex={1} gap={4}>
          {cardList}
          <Pagination count={filteredData.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
        </Stack>
      </Stack>
    </PageContainer>
  );
}
