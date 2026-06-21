import { useState } from "react";
import { Stack, Center, Text, HStack, IconButton, ButtonGroup } from "@chakra-ui/react";
import { Pagination } from "@chakra-ui/react";
import SortControl, { type SortOption } from "./SortControl";
import DegreeStatCard from "./DegreeStatsCard";
import SearchInput from "./SearchInput";
import useStatisticsQuery from "../hooks/useStatisticsQuery";
import useFilteredStatistics from "../hooks/useFilteredStatistics";
import DegreeStatsCardSkeleton from "./DegreeStatsCardSkeleton";

const PAGE_SIZE = 10;

export default function StatsListPage() {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const query = useStatisticsQuery();
  const filteredData = useFilteredStatistics(query.data, searchTerm, sortOrder);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const degreeSkeletonList = Array.from({ length: 10 }).map((_, i) => <DegreeStatsCardSkeleton key={i} />);

  return (
    <Center h="100%" px={8}>
      <Stack direction="column" gap={4} width="800px" p={2}>
        <Stack direction="row" px={4} gap={8}>
          <SearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            placeholder="Hae koulua tai linjaa"
          />
          <SortControl
            value={sortOrder}
            onChange={(value) => {
              setSortOrder(value);
              setPage(1);
            }}
          />
        </Stack>

        <Stack direction="column" height="1200px" overflowY="scroll" gap={4} px={4}>
          {query.isPending ? degreeSkeletonList : null}
          {query.isError ? <Text>Haku keskeytetty virheen takia.</Text> : null}
          {!query.isPending && !query.isError && paginated.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
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
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>{page.value}</IconButton>
                )}
              />
            </ButtonGroup>
          </HStack>
        </Pagination.Root>
      </Stack>
    </Center>
  );
}
