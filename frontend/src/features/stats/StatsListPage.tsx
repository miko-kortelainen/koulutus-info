import { useMemo, useState } from "react";
import { Stack, Center, Text, HStack, IconButton, ButtonGroup } from "@chakra-ui/react";
import { Pagination } from "@chakra-ui/react";
import SortControl, { type SortOption } from "./components/SortControl";
import SchoolCard from "./components/DegreeStatsCard";
import SearchInput from "./components/SearchInput";
import useStatisticsQuery from "./hooks/useStatisticsQuery";

const PAGE_SIZE = 10;

export default function DegreeListPage() {
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const query = useStatisticsQuery(sortOrder);

  const filteredData = useMemo(() => {
    const data = query.data ?? [];
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((degree) => {
      const searchableText = [
        degree.hakukohde,
        degree.korkeakoulu,
        degree.koulutuksenKieli,
        degree.sektori,
        degree.koulutusalaTaso1,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [query.data, searchTerm]);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Center h="100%" px={8}>
      <Stack direction="column" gap={4} width="800px" p={2}>
        <HStack justify="space-between">
          <SortControl value={sortOrder} onChange={setSortOrder} />
          <SearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            placeholder="Search statistics"
          />
        </HStack>
        {query.isPending ? <Text>Fetching statistics..</Text> : null}
        {query.isError ? <Text>Error fetching statistics..</Text> : null}

        <Stack direction="column" height="1200px" overflowY="scroll" gap={4} px={4}>
          {!query.isPending && !query.isError && paginated.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
          {paginated.map((d, index) => (
            <SchoolCard degree={d} key={`${d.hakukohde}, ${index}`} />
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
