import { Stack, Center, Text, HStack, IconButton, ButtonGroup } from "@chakra-ui/react";
import { Pagination } from "@chakra-ui/react";
import SchoolCard from "./SchoolCard";
import SortControl, { type SortOption } from "./SortControl";
import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "../../apis";
import { useState } from "react";
import type { VipunenData } from "../../types.gen";

const PAGE_SIZE = 10;

export default function DegreeListPage() {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const query = useQuery<VipunenData[]>({
    queryKey: ["statistics", sortOrder],
    queryFn: () => getStatistics(sortOrder),
    refetchOnWindowFocus: false,
    staleTime: Infinity, // old: 30 * 60 * 1000
    gcTime: 10 * 60 * 1000, // 10 min
  });

  const paginated = query.data?.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Center h="100%" px={8}>
      <Stack direction="column" gap={4} width="800px" p={2}>
        <HStack justify="space-between">
          <SortControl value={sortOrder} onChange={setSortOrder} />
        </HStack>
        {query.isPending ? <Text>Fetching statistics..</Text> : null}
        {query.isError ? <Text>Error fetching statistics..</Text> : null}

        <Stack direction="column" height="1200px" overflowY="scroll" gap={4} px={4}>
          {paginated?.map((d, index) => (
            <SchoolCard degree={d} key={`${d.hakukohde}, ${index}`} />
          ))}
        </Stack>

        <Pagination.Root
          count={query.data?.length ?? 0}
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
