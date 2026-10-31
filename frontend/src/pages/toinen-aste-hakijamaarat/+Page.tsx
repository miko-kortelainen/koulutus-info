import { Accordion, Alert, Box, Group, Stack, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import DebouncedSearchInput from "@/components/DebouncedSearchInput";
import DegreeStatsCard from "@/components/DegreeStatsCard";
import { FilterItem, selectFilter, toCollection } from "@/components/FilterAccordion";
import OptionSelect from "@/components/OptionSelect";
import Pagination from "@/components/Pagination";
import { TOINEN_ASTE_YEARS } from "@/config/toinenAsteYears";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import DegreeStatsCardSkeleton from "@/components/DegreeStatsCardSkeleton";
import ResultCount from "@/components/ResultCount";
import SortControl from "@/components/StatisticsSortControl";
import useFilteredStatistics from "@/hooks/useFilteredStatistics";
import type { SortOption } from "@/lib/sortStatistics";
import type { StatisticsEntry } from "@/types.gen";

type Entry = StatisticsEntry & { oppilaitos: string; koulutusasteTaso2: string; kooditTutkintoHakukohde: string };
const TRAINING_TYPES: Record<string, string> = {
  "999908": "TUVA",
  "999903": "TELMA",
  "999909": "Kansanopistojen opistovuosi",
};
const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
const EMPTY_FILTER = new Set<string>();

export default function ToinenAsteHakijamaarat() {
  const [entries, setEntries] = useState<StatisticsEntry[] | undefined>();
  const [year, setYear] = useState<string>(TOINEN_ASTE_YEARS[0]);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("asc");
  const [page, setPage] = useState(1);
  const [types, setTypes] = useState<Set<string>>(new Set());
  const [fields, setFields] = useState<Set<string>>(new Set());
  const [languages, setLanguages] = useState<Set<string>>(new Set());
  const [municipalities, setMunicipalities] = useState<Set<string>>(new Set());
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/data/toinen-aste/hakijamaarat-${year}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Data unavailable");
        return response.json() as Promise<Entry[]>;
      })
      .then((rows) =>
        setEntries(
          rows.map((row) => ({
            ...row,
            korkeakoulu: row.oppilaitos,
            koulutusasteTaso1: TRAINING_TYPES[row.kooditTutkintoHakukohde] ?? row.koulutusasteTaso2,
            okmOhjauksenAla: row.koulutusalaTaso1,
          })),
        ),
      )
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [year]);
  const typeOptions = useMemo(() => toCollection(entries?.map((e) => e.koulutusasteTaso1)), [entries]);
  const fieldOptions = useMemo(() => toCollection(entries?.map((e) => e.okmOhjauksenAla)), [entries]);
  const languageOptions = useMemo(() => toCollection(entries?.map((e) => e.koulutuksenKieli)), [entries]);
  const municipalityOptions = useMemo(() => toCollection(entries?.map((e) => e.kuntaHakukohde)), [entries]);
  const filtered = useFilteredStatistics(
    entries,
    search,
    sort,
    EMPTY_FILTER,
    types,
    fields,
    languages,
    municipalities,
    EMPTY_FILTER,
  );
  const resetPage = () => setPage(1);
  return (
    <>
      <PageIntro
        title="Toisen asteen hakijamäärät"
        description="Selaa toisen asteen yhteishaun lukioiden ja ammattikoulujen hakijamääriä koulutuksittain."
      />
      <PageContainer align="flex-start">
        <Stack align="start" direction={{ base: "column", md: "row" }} gap={6} width="full">
          <Stack gap={4} position={{ md: "sticky" }} width={{ base: "100%", md: "72" }}>
            <DebouncedSearchInput onChange={setSearch} onInput={resetPage} placeholder="Hae koulua tai linjaa" />
            <Accordion.Root multiple size="sm">
              <FilterItem
                collection={typeOptions}
                label="Koulutusaste"
                onChange={selectFilter(setTypes, resetPage)}
                selected={types}
                value="koulutusaste"
              />
              <FilterItem
                collection={fieldOptions}
                label="Koulutusala"
                onChange={selectFilter(setFields, resetPage)}
                selected={fields}
                value="koulutusala"
              />
              <FilterItem
                collection={languageOptions}
                label="Kieli"
                onChange={selectFilter(setLanguages, resetPage)}
                selected={languages}
                value="kieli"
              />
              <FilterItem
                collection={municipalityOptions}
                label="Kunta"
                onChange={selectFilter(setMunicipalities, resetPage)}
                selected={municipalities}
                value="kunta"
              />
            </Accordion.Root>
          </Stack>
          <Stack flex={1} gap={4} minW={0} width="100%">
            <Group gap={6} width="full" zIndex={10}>
              <SortControl
                value={sort}
                onChange={(value) => {
                  setSort(value);
                  resetPage();
                }}
              />
              <OptionSelect
                ariaLabel="Yhteishaku"
                items={TOINEN_ASTE_YEARS.map((value) => ({ value, label: `Yhteishaku ${value}` }))}
                value={year}
                onChange={(value) => {
                  if (value === year) return;
                  setEntries(undefined);
                  setError(false);
                  setYear(value);
                  setTypes(new Set());
                  setFields(new Set());
                  setLanguages(new Set());
                  setMunicipalities(new Set());
                  resetPage();
                }}
              />
            </Group>
            <ResultCount count={filtered.length} error={error} loading={!entries && !error} />
            <Stack as="ul" direction="column" gap={4} listStyleType="none">
              {!entries && !error ? SKELETON_KEYS.map((key) => <DegreeStatsCardSkeleton key={key} />) : null}
              {error ? (
                <Box as="li">
                  <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Title>Tietojen lataaminen epäonnistui.</Alert.Title>
                  </Alert.Root>
                </Box>
              ) : null}
              {entries && filtered.length === 0 ? <Text as="li">Ei tuloksia hakusanoilla.</Text> : null}
              {filtered.slice((page - 1) * 10, page * 10).map((entry) => (
                <DegreeStatsCard key={entry.kooditHakukohde} degree={entry} schoolLink={false} />
              ))}
            </Stack>
            {entries ? <Pagination count={filtered.length} page={page} pageSize={10} onPageChange={setPage} /> : null}
          </Stack>
        </Stack>
        <Text color="fg.muted" fontSize="xs">
          Lähde: Opetushallinnon tilastopalvelu Vipunen
        </Text>
      </PageContainer>
    </>
  );
}
