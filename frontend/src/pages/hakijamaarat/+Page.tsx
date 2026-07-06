import { useCallback, useState } from "react";
import { Stack, Text, Group, Alert, Heading, Box } from "@chakra-ui/react";
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
import type { StatisticsEntry, StatisticsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

export default function StatsListPage() {
  const ssrData = useData<StatisticsResponse>();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [selectedYear, setSelectedYear] = useState<YearOption>("2026");
  const [searchTerm, setSearchTerm] = useState("");
  const [compareSelection, setCompareSelection] = useState<StatisticsEntry[]>([]);
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

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredStatistics(query.data, debouncedSearchTerm, sortOrder);
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

  const sortControls = (
    <Stack direction={{ base: "column", md: "row" }} gap={2} zIndex={10}>
      <SearchInput
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Hae koulua tai linjaa"
      />
      <Group flex={1}>
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
    </Stack>
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
        {sortControls}
        {cardList}
        <Pagination count={filteredData.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        {compareSelection.length > 0 ? <Box h="72px" /> : null}
      </PageContainer>
      <CompareBar selected={compareSelection} year={selectedYear} onRemove={toggleCompare} />
    </>
  );
}
