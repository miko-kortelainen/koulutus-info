import {
  Accordion,
  Checkmark,
  Heading,
  Listbox,
  Separator,
  Span,
  Stack,
  Text,
  createListCollection,
  useListboxItemContext,
  type ListCollection,
} from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import Pagination from "@/components/Pagination";
import { useData } from "vike-react/useData";
import useSchoolsQuery from "./hooks/useSchoolsQuery";
import SchoolCard from "@/components/SchoolCard";
import { useMemo, useState } from "react";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import useFilteredDegrees from "./hooks/useFilteredDegrees";
import type { SchoolsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  amk: "Ammattikorkeakoulu",
  yo: "Yliopisto",
};

function toCollection(values: (string | undefined)[] | undefined, label = (v: string) => v) {
  const unique = [...new Set(values?.filter((v): v is string => Boolean(v)))].sort();
  return createListCollection({ items: unique.map((v) => ({ label: label(v), value: v })) });
}

const ItemCheckmark = () => {
  const { selected, disabled } = useListboxItemContext();
  return <Checkmark filled size="sm" checked={selected} disabled={disabled} />;
};

interface FilterItemProps {
  value: string;
  label: string;
  collection: ListCollection<{ label: string; value: string }>;
  selected: Set<string>;
  onChange: (values: string[]) => void;
}

function FilterItem({ value, label, collection, selected, onChange }: FilterItemProps) {
  return (
    <Accordion.Item value={value}>
      <Accordion.ItemTrigger>
        <Span flex="1">
          {label}
          {selected.size > 0 ? ` (${selected.size})` : ""}
        </Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>
          <Listbox.Root
            selectionMode="multiple"
            collection={collection}
            value={[...selected]}
            onValueChange={(details) => onChange(details.value)}
          >
            <Listbox.Content maxH="56" gap={2}>
              {collection.items.map((item) => (
                <Listbox.Item key={item.value} item={item}>
                  <ItemCheckmark />
                  <Listbox.ItemText mb="2px">{item.label}</Listbox.ItemText>
                </Listbox.Item>
              ))}
            </Listbox.Content>
          </Listbox.Root>
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

export default function SchoolsListPage() {
  const ssrData = useData<SchoolsResponse>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const query = useSchoolsQuery(ssrData);
  const toteutukset = useMemo(
    () => query.data?.flatMap((k) => k.toteutukset.map((t) => ({ ...t, koulutustyyppi: k.koulutustyyppi }))),
    [query.data],
  );
  const sektoriCollection = useMemo(
    () =>
      toCollection(
        query.data?.map((k) => k.koulutustyyppi),
        (s) => SEKTORI_LABELS[s] ?? s,
      ),
    [query.data],
  );
  const kuntaCollection = useMemo(() => toCollection(toteutukset?.flatMap((t) => t.kunnat)), [toteutukset]);
  const schoolCollection = useMemo(() => toCollection(toteutukset?.map((t) => t.oppilaitosNimi.fi)), [toteutukset]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredDegrees(
    toteutukset,
    debouncedSearchTerm,
    selectedSektorit,
    selectedKunnat,
    selectedSchools,
  );

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const selectFilter = (setter: (values: Set<string>) => void) => (values: string[]) => {
    setter(new Set(values));
    setPage(1);
  };

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Koulutukset
      </Heading>
      <Text color="fg.muted">Korkeakoulujen syksyn 2026 yhteishaussa olevat toteutukset.</Text>
      <Separator mt={2} />
    </Stack>
  );

  const sortControls = (
    <Stack position={{ md: "sticky" }} width={{ base: "100%", md: "80" }}>
      <SearchInput
        value={searchTerm}
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Etsi koulutuksia"
      />
      <Accordion.Root multiple>
        <FilterItem
          value="sektori"
          label="Sektori"
          collection={sektoriCollection}
          selected={selectedSektorit}
          onChange={selectFilter(setSelectedSektorit)}
        />
        <FilterItem
          value="kunta"
          label="Kunta"
          collection={kuntaCollection}
          selected={selectedKunnat}
          onChange={selectFilter(setSelectedKunnat)}
        />
        <FilterItem
          value="koulu"
          label="Koulu"
          collection={schoolCollection}
          selected={selectedSchools}
          onChange={selectFilter(setSelectedSchools)}
        />
      </Accordion.Root>
    </Stack>
  );

  const cardList = (
    <Stack direction="column" gap={4}>
      {paginated.map((t, index) => (
        <SchoolCard key={`${t.toteutusOid} ${t.toteutusNimi} ${index}`} toteutus={t} />
      ))}
    </Stack>
  );

  return (
    <PageContainer>
      {header}

      <Stack direction={{ base: "column", md: "row" }} align="start" gap={4}>
        {sortControls}

        <Stack flex={1} gap={4}>
          {query.isPending ? <Text>Haetaan</Text> : null}
          {query.isError ? <Text>Virhe</Text> : null}
          {!query.isPending && !query.isError && paginated.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
          {cardList}
          <Pagination count={filteredData.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </Stack>
      </Stack>
    </PageContainer>
  );
}
