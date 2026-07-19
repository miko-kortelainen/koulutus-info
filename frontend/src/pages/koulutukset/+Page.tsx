import { Accordion, Checkbox, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { FilterItem, selectFilter, toCollection } from "@/components/FilterAccordion";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import SearchInput from "@/components/SearchInput";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import type { SchoolsResponse } from "@/types.gen";
import useFilteredDegrees from "./hooks/useFilteredDegrees";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  amk: "Ammattikorkeakoulu",
  yo: "Yliopisto",
};

export default function SchoolsListPage() {
  const data = useData<SchoolsResponse>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [showYlempiAmk, setShowYlempiAmk] = useState(false);
  const toteutukset = useMemo(
    () =>
      data.flatMap((k) =>
        k.toteutukset.map((t) => ({
          ...t,
          koulutustyyppi: k.koulutustyyppi,
          ylempiAmk: k.koulutustyyppi === "amk" && (k.nimi.fi?.toLowerCase().includes("ylempi") ?? false),
        })),
      ),
    [data],
  );
  const sektoriCollection = useMemo(
    () =>
      toCollection(
        data.map((k) => k.koulutustyyppi),
        (s) => SEKTORI_LABELS[s] ?? s,
      ),
    [data],
  );
  const kuntaCollection = useMemo(() => toCollection(toteutukset.flatMap((t) => t.kunnat)), [toteutukset]);
  const schoolCollection = useMemo(() => toCollection(toteutukset.map((t) => t.oppilaitosNimi.fi)), [toteutukset]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredDegrees(
    toteutukset,
    debouncedSearchTerm,
    selectedSektorit,
    selectedKunnat,
    selectedSchools,
    showYlempiAmk,
  );

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

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
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Etsi koulutuksia"
        value={searchTerm}
      />

      <Accordion.Root multiple>
        <FilterItem
          collection={sektoriCollection}
          label="Sektori"
          onChange={selectFilter(setSelectedSektorit, () => setPage(1))}
          selected={selectedSektorit}
          value="sektori"
        >
          <Checkbox.Root
            checked={showYlempiAmk}
            mt={4}
            onCheckedChange={(details) => {
              setShowYlempiAmk(!!details.checked);
              setPage(1);
            }}
            size="sm"
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Label color="fg.muted">Näytä myös ylemmät AMK-tutkinnot</Checkbox.Label>
          </Checkbox.Root>
        </FilterItem>
        <FilterItem
          collection={kuntaCollection}
          label="Kunta"
          onChange={selectFilter(setSelectedKunnat, () => setPage(1))}
          selected={selectedKunnat}
          value="kunta"
        />
        <FilterItem
          collection={schoolCollection}
          label="Koulu"
          onChange={selectFilter(setSelectedSchools, () => setPage(1))}
          selected={selectedSchools}
          value="koulu"
        />
      </Accordion.Root>
    </Stack>
  );

  const cardList = (
    <Stack as="ul" direction="column" gap={4} listStyleType="none">
      {paginated.length === 0 ? <Text as="li">Ei tuloksia hakusanoilla.</Text> : null}
      {paginated.map((t) => (
        <SchoolCard key={t.toteutusOid} toteutus={t} />
      ))}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}

      <Stack align="start" direction={{ base: "column", md: "row" }} gap={4}>
        {sortControls}

        <Stack flex={1} gap={4}>
          {cardList}
          <Pagination count={filteredData.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
        </Stack>
      </Stack>
    </PageContainer>
  );
}
