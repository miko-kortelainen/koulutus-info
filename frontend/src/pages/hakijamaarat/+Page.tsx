import { useState } from "react";
import { Stack, Text, HStack, IconButton, ButtonGroup, Group, Alert, Heading } from "@chakra-ui/react";
import { Pagination } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import SortControl, { type SortOption } from "./components/SortControl";
import DegreeStatCard from "./components/DegreeStatsCard";
import SearchInput from "./components/SearchInput";
import useStatisticsQuery from "./hooks/useStatisticsQuery";
import useFilteredStatistics from "./hooks/useFilteredStatistics";
import DegreeStatsCardSkeleton from "./components/DegreeStatsCardSkeleton";
import YearControl from "./components/YearControl";
import { type YearOption } from "./components/yearOptions";
import type { StatisticsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

export default function StatsListPage() {
  const ssrData = useData<StatisticsResponse>();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [selectedYear, setSelectedYear] = useState<YearOption>("2026");
  const [searchTerm, setSearchTerm] = useState("");
  const query = useStatisticsQuery(selectedYear, selectedYear === "2026" ? ssrData : undefined);
  const filteredData = useFilteredStatistics(query.data, searchTerm, sortOrder);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const degreeSkeletonList = Array.from({ length: 10 }).map((_, i) => <DegreeStatsCardSkeleton key={i} />);

  const errorAlert = (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
    </Alert.Root>
  );

  return (
    <>
      <PageContainer>
          <Stack gap={1}>
            <Heading as="h1" size="lg">
              Hakijamäärät
            </Heading>
            <Text color="fg.muted">
              Selaa korkeakoulujen yhteishaun hakijamääriä hakukohteittain.
            </Text>
          </Stack>
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
                    <IconButton
                      variant={{ base: "ghost", _selected: "outline" }}
                      onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
                    >
                      {page.value}
                    </IconButton>
                  )}
                />
              </ButtonGroup>
            </HStack>
          </Pagination.Root>
      </PageContainer>
    </>
  );
}
