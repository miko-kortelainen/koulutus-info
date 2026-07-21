import { Accordion, Alert, Box, Group, Heading, Stack, Text } from "@chakra-ui/react";
import { useCallback, useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import CompareBar from "@/components/CompareBar";
import DegreeStatsCard from "@/components/DegreeStatsCard";
import { FilterItem, selectFilter, toCollection } from "@/components/FilterAccordion";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import YearControl from "@/components/YearControl";
import { CURRENT_YEAR, type YearOption } from "@/config/yearOptions";
import useDebounce from "@/hooks/useDebounce";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import PageContainer from "@/layout/PageContainer";
import type { StatisticsEntry, StatisticsResponse } from "@/types.gen";
import DegreeStatsCardSkeleton from "./components/DegreeStatsCardSkeleton";
import SortControl from "./components/SortControl";
import useFilteredStatistics from "./hooks/useFilteredStatistics";
import type { SortOption } from "./lib/sortStatistics";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  Yliopistokoulutus: "Yliopisto",
  Ammattikorkeakoulukoulutus: "Ammattikorkeakoulu",
};

export default function StatsListPage() {
  const ssrData = useData<StatisticsResponse>();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [selectedYear, setSelectedYear] = useState<YearOption>(CURRENT_YEAR);
  const [searchTerm, setSearchTerm] = useState("");
  const [compareSelection, setCompareSelection] = useState<StatisticsEntry[]>([]);
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKoulutusasteet, setSelectedKoulutusasteet] = useState<Set<string>>(new Set());
  const [selectedKoulutusalat, setSelectedKoulutusalat] = useState<Set<string>>(new Set());
  const [selectedKielet, setSelectedKielet] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const query = useStatisticsQuery(selectedYear, selectedYear === CURRENT_YEAR ? ssrData : undefined);

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
  const koulutusasteCollection = useMemo(() => toCollection(query.data?.map((d) => d.koulutusasteTaso1)), [query.data]);
  const koulutusalaCollection = useMemo(() => toCollection(query.data?.map((d) => d.okmOhjauksenAla)), [query.data]);
  const kieliCollection = useMemo(() => toCollection(query.data?.map((d) => d.koulutuksenKieli)), [query.data]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredStatistics(
    query.data,
    debouncedSearchTerm,
    sortOrder,
    selectedSektorit,
    selectedKoulutusasteet,
    selectedKoulutusalat,
    selectedKielet,
    selectedKunnat,
    selectedSchools,
  );
  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const degreeSkeletonList = Array.from({ length: 10 }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed loading placeholders have no identity or state
    <DegreeStatsCardSkeleton key={i} />
  ));

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
    <Stack position={{ md: "sticky" }} width={{ base: "100%", md: "72" }}>
      <SearchInput
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Hae koulua tai linjaa"
        value={searchTerm}
      />
      <Accordion.Root multiple size="sm">
        <FilterItem
          collection={sektoriCollection}
          label="Sektori"
          onChange={selectFilter(setSelectedSektorit, () => setPage(1))}
          selected={selectedSektorit}
          value="sektori"
        />
        <FilterItem
          collection={koulutusasteCollection}
          label="Koulutusaste"
          onChange={selectFilter(setSelectedKoulutusasteet, () => setPage(1))}
          selected={selectedKoulutusasteet}
          value="koulutusaste"
        />
        <FilterItem
          collection={koulutusalaCollection}
          label="Koulutusala"
          onChange={selectFilter(setSelectedKoulutusalat, () => setPage(1))}
          selected={selectedKoulutusalat}
          value="koulutusala"
        />
        <FilterItem
          collection={kieliCollection}
          label="Kieli"
          onChange={selectFilter(setSelectedKielet, () => setPage(1))}
          selected={selectedKielet}
          value="kieli"
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

  const sortYearControls = (
    <Group flex={1} gap={6} zIndex={10}>
      <SortControl
        onChange={(value) => {
          setSortOrder(value);
          setPage(1);
        }}
        value={sortOrder}
      />
      <YearControl
        onChange={(value) => {
          setSelectedYear(value);
          setPage(1);
          setCompareSelection([]);
          setSelectedSektorit(new Set());
          setSelectedKoulutusasteet(new Set());
          setSelectedKoulutusalat(new Set());
          setSelectedKielet(new Set());
          setSelectedKunnat(new Set());
          setSelectedSchools(new Set());
        }}
        value={selectedYear}
      />
    </Group>
  );

  const cardList = (
    <Stack
      as="ul"
      direction="column"
      gap={4}
      listStyleType="none"
      opacity={query.isPending ? 1 : query.isFetching ? 0.5 : 1}
      transition="opacity 0.15s"
    >
      {query.isPending ? degreeSkeletonList : null}
      {query.isError ? <Box as="li">{errorAlert}</Box> : null}
      {!query.isPending && !query.isError && paginated.length === 0 ? (
        <Text as="li">Ei tuloksia hakusanoilla.</Text>
      ) : null}
      {paginated.map((d) => (
        <DegreeStatsCard
          degree={d}
          isSelected={compareSelection.some((s) => s.kooditHakukohde === d.kooditHakukohde)}
          key={d.kooditHakukohde}
          onToggleCompare={toggleCompare}
          selectionFull={compareSelection.length === 2}
        />
      ))}
    </Stack>
  );

  return (
    <>
      <PageContainer align="flex-start">
        {header}

        <Stack align="start" direction={{ base: "column", md: "row" }} gap={4}>
          {sidebar}

          <Stack flex={1} gap={4} width="100%">
            {sortYearControls}
            {!query.isPending && !query.isError ? (
              <Text color="fg.muted" fontSize="xs" ml="auto" mt={-3}>
                {filteredData.length} {filteredData.length === 1 ? "hakutulos" : "hakutulosta"}
              </Text>
            ) : null}
            {cardList}
            <Pagination count={filteredData.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
          </Stack>
        </Stack>

        {compareSelection.length > 0 ? <Box h="72px" /> : null}
      </PageContainer>
      <CompareBar onRemove={toggleCompare} selected={compareSelection} year={selectedYear} />
    </>
  );
}
