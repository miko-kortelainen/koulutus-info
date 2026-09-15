import { Accordion, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { FilterItem, selectFilter, toCollection } from "@/components/FilterAccordion";
import OptionSelect from "@/components/OptionSelect";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import SearchInput from "@/components/SearchInput";
import {
  CURRENT_PROGRAMME_ROUND,
  PROGRAMME_ROUND_OPTIONS,
  programmeRoundIntro,
  type ProgrammeRound,
} from "@/config/programmeRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import useFilteredDegrees from "@/pages/koulutukset/hooks/useFilteredDegrees";
import type { KoulutuksetPageData } from "@/pages/koulutukset/+data";
import type { CurrentProgramsResponse } from "@/types.gen";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  amk: "Ammattikorkeakoulu",
  yo: "Yliopisto",
};

const TASO_LABELS: Record<string, string> = {
  alempi: "Alempi",
  ylempi: "Ylempi",
};

function flattenToteutukset(programmes: CurrentProgramsResponse) {
  return programmes.flatMap((k) =>
    k.toteutukset.map((t) => ({ ...t, sektori: k.sektori, tutkintotaso: k.tutkintotaso })),
  );
}

export default function SchoolsListPage() {
  const data = useData<KoulutuksetPageData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRound, setSelectedRound] = useState<ProgrammeRound>(CURRENT_PROGRAMME_ROUND);
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const [selectedTasot, setSelectedTasot] = useState<Set<string>>(new Set());
  const [selectedKoulutusalat, setSelectedKoulutusalat] = useState<Set<string>>(new Set());
  const programmes = data[selectedRound];
  const toteutukset = useMemo(() => flattenToteutukset(programmes), [programmes]);
  const sektoriCollection = useMemo(
    () =>
      toCollection(
        programmes.map((k) => k.sektori),
        (s) => SEKTORI_LABELS[s] ?? s,
      ),
    [programmes],
  );
  const tasoCollection = useMemo(
    () =>
      toCollection(
        programmes.map((k) => k.tutkintotaso),
        (t) => TASO_LABELS[t] ?? t,
      ),
    [programmes],
  );
  const kuntaCollection = useMemo(() => toCollection(toteutukset.flatMap((t) => t.kunnat)), [toteutukset]);
  const schoolCollection = useMemo(() => toCollection(toteutukset.map((t) => t.oppilaitosNimi.fi)), [toteutukset]);
  const koulutusalaCollection = useMemo(
    () => toCollection(toteutukset.flatMap((t) => t.koulutusalat ?? [])),
    [toteutukset],
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredDegrees(
    toteutukset,
    debouncedSearchTerm,
    selectedSektorit,
    selectedKunnat,
    selectedSchools,
    selectedTasot,
    selectedKoulutusalat,
  );

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const sortControls = (
    <Stack position={{ md: "sticky" }} width={{ base: "100%", md: "80" }}>
      <OptionSelect
        ariaLabel="Yhteishaku"
        items={PROGRAMME_ROUND_OPTIONS}
        onChange={(round) => {
          setSelectedRound(round);
          setPage(1);
          setSelectedSektorit(new Set());
          setSelectedTasot(new Set());
          setSelectedKoulutusalat(new Set());
          setSelectedKunnat(new Set());
          setSelectedSchools(new Set());
        }}
        placeholder="Valitse yhteishaku"
        size="sm"
        value={selectedRound}
      />
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
        />
        <FilterItem
          collection={tasoCollection}
          label="Koulutusaste"
          onChange={selectFilter(setSelectedTasot, () => setPage(1))}
          selected={selectedTasot}
          value="koulutusaste"
        />
        <FilterItem
          collection={koulutusalaCollection}
          label="Koulutusala"
          onChange={selectFilter(setSelectedKoulutusalat, () => setPage(1))}
          selected={selectedKoulutusalat}
          value="koulutusala"
        />
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
    <>
      <PageIntro description={programmeRoundIntro(selectedRound)} title="Koulutukset" />
      <PageContainer align="flex-start">
        <Stack align="start" direction={{ base: "column", md: "row" }} gap={4}>
          {sortControls}

          <Stack flex={1} gap={4} width="100%">
            {cardList}
            <Pagination count={filteredData.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
          </Stack>
        </Stack>
      </PageContainer>
    </>
  );
}
