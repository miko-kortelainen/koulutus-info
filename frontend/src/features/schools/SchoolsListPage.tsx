import { ButtonGroup, Center, HStack, IconButton, Pagination, Stack, Text } from "@chakra-ui/react";
import useSchoolsQuery from "./hooks/useSchoolsQuery";
import SchoolCard from "./components/SchoolCard";
import { useState } from "react";
import SearchInput from "../stats/components/SearchInput";
import useFilteredDegrees from "./hooks/useFilteredDegrees";

const PAGE_SIZE = 10;

export default function SchoolsListPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const query = useSchoolsQuery();
  const toteutukset = query.data && query.data.flatMap((k) => k.toteutukset);
  const filteredData = useFilteredDegrees(toteutukset, searchTerm);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
            placeholder="Etsi koulutuksia"
          />
        </Stack>
        {query.isPending ? <Text>Haetaan</Text> : null}
        {query.isError ? <Text>Virhe</Text> : null}
        {!query.isPending && !query.isError && paginated.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}

        <Stack direction="column" height="1200px" overflowY="scroll" gap={4} px={4}>
          {paginated.map((t, index) => (
            <SchoolCard key={`${t.toteutusOid} ${t.toteutusNimi} ${index}`} toteutus={t} />
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
