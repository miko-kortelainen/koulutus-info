import { useCallback, useMemo, useState } from "react";
import { Accordion, Stack, Text, Group, Alert, Heading, Box } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import Pagination from "@/components/Pagination";
import { useData } from "vike-react/useData";
import SortControl, { type SortOption } from "./components/SortControl";
import DegreeStatCard from "@/components/DegreeStatsCard";
import SearchInput from "@/components/SearchInput";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import useFilteredStatistics from "./hooks/useFilteredStatistics";
import useDebounce from "@/hooks/useDebounce";
import DegreeStatsCardSkeleton from "./components/DegreeStatsCardSkeleton";
import YearControl from "./components/YearControl";
import { type YearOption } from "./components/yearOptions";
import CompareBar from "@/components/CompareBar";
import { toCollection, FilterItem, selectFilter } from "@/components/FilterAccordion";
import type { StatisticsEntry, StatisticsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  Yliopistokoulutus: "Yliopisto",
  Ammattikorkeakoulukoulutus: "Ammattikorkeakoulu",
};

export default function StatsListPage() {
  const ssrData = useData<StatisticsResponse>();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [selectedYear, setSelectedYear] = useState<YearOption>("2026");
  const [searchTerm, setSearchTerm] = useState("");
  const [compareSelection, setCompareSelection] = useState<StatisticsEntry[]>([]);
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const query = useStatisticsQuery(selectedYear, selectedYear === "2026" ? ssrData : undefined);

  const toggleCompare = useCallback((degree: StatisticsEntry) => {
    setCompareSelection((prev) =>
      prev.some((d) => d.kooditHakukohde === degree.kooditHakukohde)
        ? prev.filter((d) => d.kooditHakukohde !== degree.kooditHakukohde)
        : prev.length < 2
          ? [...prev, degree]
          : prev,
    );
  }, []);

  const sektoriCollection = useMemo(
    () =>
      toCollection(
        query.data?.map((d) => d.sektori),
        (s) => SEKTORI_LABELS[s] ?? s,
      ),
    [query.data],
  );
  const kuntaCollection = useMemo(() => toCollection(query.data?.map((d) => d.kuntaHakukohde)), [query.data]);
  const schoolCollection = useMemo(() => toCollection(query.data?.map((d) => d.korkeakoulu)), [query.data]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredStatistics(
    query.data,
    debouncedSearchTerm,
    sortOrder,
    selectedSektorit,
    selectedKunnat,
    selectedSchools,
  );
  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const degreeSkeletonList = Array.from({ length: 10 }).map((_, i) => <DegreeStatsCardSkeleton key={i} />);

  const errorAlert = (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
    </Alert.Root>
  );

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Hakijamäärät
      </Heading>
      <Text color="fg.muted">Selaa korkeakoulujen yhteishaun hakijamääriä hakukohteittain.</Text>
    </Stack>
  );

  const sidebar = (
    <Stack position={{ md: "sticky" }} width={{ base: "100%", md: "80" }}>
      <SearchInput
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Hae koulua tai linjaa"
      />
      <Accordion.Root multiple>
        <FilterItem
          value="sektori"
          label="Sektori"
          collection={sektoriCollection}
          selected={selectedSektorit}
          onChange={selectFilter(setSelectedSektorit, () => setPage(1))}
        />
        <FilterItem
          value="kunta"
          label="Kunta"
          collection={kuntaCollection}
          selected={selectedKunnat}
          onChange={selectFilter(setSelectedKunnat, () => setPage(1))}
        />
        <FilterItem
          value="koulu"
          label="Koulu"
          collection={schoolCollection}
          selected={selectedSchools}
          onChange={selectFilter(setSelectedSchools, () => setPage(1))}
        />
      </Accordion.Root>
    </Stack>
  );

  const sortYearControls = (
    <Group flex={1} zIndex={10}>
      <SortControl
        value={sortOrder}
        onChange={(value) => {
          setSortOrder(value);
          setPage(1);
        }}
      />
      <YearControl
        value={selectedYear}
        onChange={(value) => {
          setSelectedYear(value);
          setPage(1);
          setCompareSelection([]);
        }}
      />
    </Group>
  );

  const cardList = (
    <Stack direction="column" gap={4}>
      {query.isPending ? degreeSkeletonList : null}
      {query.isError ? errorAlert : null}
      {!query.isPending && !query.isError && paginated.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
      {paginated.map((d, index) => (
        <DegreeStatCard
          degree={d}
          key={`${d.hakukohde}, ${index}`}
          isSelected={compareSelection.some((s) => s.kooditHakukohde === d.kooditHakukohde)}
          selectionFull={compareSelection.length === 2}
          onToggleCompare={toggleCompare}
        />
      ))}
    </Stack>
  );

  return (
    <>
      <PageContainer>
        {header}

        <Stack direction={{ base: "column", md: "row" }} align="start" gap={4}>
          {sidebar}

          <Stack flex={1} gap={4}>
            {sortYearControls}
            {cardList}
            <Pagination count={filteredData.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </Stack>
        </Stack>

        {compareSelection.length > 0 ? <Box h="72px" /> : null}
      </PageContainer>
      <CompareBar selected={compareSelection} year={selectedYear} onRemove={toggleCompare} />
    </>
  );
}
