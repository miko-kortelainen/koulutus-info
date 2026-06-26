import { ButtonGroup, Heading, HStack, IconButton, Pagination, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import useSchoolsQuery from "./hooks/useSchoolsQuery";
import SchoolCard from "./components/SchoolCard";
import { useState } from "react";
import SearchInput from "@/pages/hakijamaarat/components/SearchInput";
import useFilteredDegrees from "./hooks/useFilteredDegrees";
import type { SchoolsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

export default function SchoolsListPage() {
  const ssrData = useData<SchoolsResponse>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const query = useSchoolsQuery(ssrData);
  const toteutukset = query.data && query.data.flatMap((k) => k.toteutukset);
  const filteredData = useFilteredDegrees(toteutukset, searchTerm);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <Stack gap={1}>
        <Heading as="h1" size="lg">
          Koulutukset
        </Heading>
        <Text color="fg.muted">Selaa korkeakoulujen koulutustarjontaa ja löydä sinulle sopiva koulutus.</Text>
      </Stack>

      <Stack direction="row" gap={2}>
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

      <Stack direction="column" gap={4}>
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
  );
}
