import { useState } from "react";
import { Stack, Center, Text, HStack, IconButton, ButtonGroup, Group, Alert } from "@chakra-ui/react";
import { Pagination } from "@chakra-ui/react";
import SortControl, { type SortOption } from "./components/SortControl";
import DegreeStatCard from "./components/DegreeStatsCard";
import SearchInput from "./components/SearchInput";
import useStatisticsQuery from "./hooks/useStatisticsQuery";
import useFilteredStatistics from "./hooks/useFilteredStatistics";
import DegreeStatsCardSkeleton from "./components/DegreeStatsCardSkeleton";
import YearControl, { type YearOption } from "./components/YearControl";

const PAGE_SIZE = 10;

export default function StatsListPage() {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [selectedYear, setSelectedYear] = useState<YearOption>("2026");
  const [searchTerm, setSearchTerm] = useState("");
  const query = useStatisticsQuery(selectedYear);
  const filteredData = useFilteredStatistics(query.data, searchTerm, sortOrder);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const degreeSkeletonList = Array.from({ length: 10 }).map((_, i) => <DegreeStatsCardSkeleton key={i} />);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "auto",
    });
  }

  const errorAlert = (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
    </Alert.Root>
  );

  return (
    <>
      <Center h="100%" px={4}>
        <Stack height="100%" direction="column" gap={4} p={2} width={{ base: "100%", md: "80%" }}>
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
                }}
              />
            </Group>
          </Stack>

          <Stack direction="column" gap={4}>
            {query.isPending ? degreeSkeletonList : null}
            {query.isError ? errorAlert : null}
            {!query.isPending && !query.isError && paginated.length === 0 ? (
              <Text>Ei tuloksia hakusanoilla.</Text>
            ) : null}
            {paginated.map((d, index) => (
              <DegreeStatCard degree={d} key={`${d.hakukohde}, ${index}`} />
            ))}
          </Stack>

          <Pagination.Root
            count={filteredData.length}
            pageSize={PAGE_SIZE}
            page={page}
            onPageChange={(e) => setPage(e.page)}
          >
            <HStack justify="center">
              <ButtonGroup variant="ghost">
                <Pagination.Items
                  render={(page) => (
                    <IconButton variant={{ base: "ghost", _selected: "outline" }} onClick={() => scrollToTop()}>
                      {page.value}
                    </IconButton>
                  )}
                />
              </ButtonGroup>
            </HStack>
          </Pagination.Root>
        </Stack>
      </Center>
    </>
  );
}
