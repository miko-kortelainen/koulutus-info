import {
  ButtonGroup,
  Checkmark,
  Heading,
  HStack,
  IconButton,
  Listbox,
  Pagination,
  Separator,
  Stack,
  Text,
  createListCollection,
  useListboxItemContext,
} from "@chakra-ui/react";

const ItemCheckmark = () => {
  const { selected, disabled } = useListboxItemContext();
  return <Checkmark filled size="sm" checked={selected} disabled={disabled} />;
};
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import useSchoolsQuery from "./hooks/useSchoolsQuery";
import SchoolCard from "./components/SchoolCard";
import { useMemo, useState } from "react";
import SearchInput from "@/pages/hakijamaarat/components/SearchInput";
import useFilteredDegrees from "./hooks/useFilteredDegrees";
import type { SchoolsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

export default function SchoolsListPage() {
  const ssrData = useData<SchoolsResponse>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const query = useSchoolsQuery(ssrData);
  const toteutukset = query.data && query.data.flatMap((k) => k.toteutukset);
  const uniqueSchools = useMemo(
    () => [...new Set(toteutukset?.map((t) => t.oppilaitosNimi.fi ?? "").filter(Boolean))].sort(),
    [toteutukset],
  );
  const schoolCollection = useMemo(
    () => createListCollection({ items: uniqueSchools.map((s) => ({ label: s, value: s })) }),
    [uniqueSchools],
  );
  const filteredData = useFilteredDegrees(toteutukset, searchTerm, selectedSchools);

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <PageContainer>
      <Stack gap={1}>
        <Heading as="h1" size="lg">
          Koulutukset
        </Heading>
        <Text color="fg.muted">Korkeakoulujen syksyn 2026 yhteishaussa olevat toteutukset.</Text>
        <Separator mt={2} />
      </Stack>

      <Stack direction={{ base: "column", md: "row" }} align="start" gap={4}>
        <Stack gap={4} position={{ md: "sticky" }} width={{ base: "100%", md: "80" }}>
          <Text color="fg.muted" fontSize="sm" ml={2} p={2}>
            Suodata koulujen perusteella
          </Text>
          <Listbox.Root
            selectionMode="multiple"
            collection={schoolCollection}
            value={[...selectedSchools]}
            onValueChange={(details) => {
              setSelectedSchools(new Set(details.value));
              setPage(1);
            }}
          >
            <Listbox.Content maxH={{ base: "56", md: "100%" }} gap={2}>
              {schoolCollection.items.map((item) => (
                <Listbox.Item key={item.value} item={item}>
                  <ItemCheckmark />
                  <Listbox.ItemText mb="2px">{item.label}</Listbox.ItemText>
                </Listbox.Item>
              ))}
            </Listbox.Content>
          </Listbox.Root>
        </Stack>

        <Stack flex={1} gap={4}>
          <SearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setPage(1);
            }}
            placeholder="Etsi koulutuksia"
          />

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
        </Stack>
      </Stack>
    </PageContainer>
  );
}
