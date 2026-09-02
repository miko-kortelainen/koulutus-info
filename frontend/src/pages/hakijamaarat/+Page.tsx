import { Accordion, Alert, Box, Group, Stack, Text } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { useWebMCP } from "use-webmcp-tool";
import { useData } from "vike-react/useData";
import { getStatistics } from "@/api/browserData";
import CompareBar from "@/components/CompareBar";
import DegreeStatsCard from "@/components/DegreeStatsCard";
import { FilterItem, selectFilter, toCollection } from "@/components/FilterAccordion";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import YearControl from "@/components/YearControl";
import { CURRENT_YEAR, YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";
import useDebounce from "@/hooks/useDebounce";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { StatisticsEntry } from "@/types.gen";
import DegreeStatsCardSkeleton from "@/pages/hakijamaarat/components/DegreeStatsCardSkeleton";
import SortControl from "@/pages/hakijamaarat/components/SortControl";
import useFilteredStatistics, { filterStatistics, toCompactStatistics } from "@/pages/hakijamaarat/hooks/useFilteredStatistics";
import type { HakijamaaratPageData } from "@/pages/hakijamaarat/+data";
import { formatStatisticsUpdatedAt } from "@/pages/hakijamaarat/lib/formatStatisticsUpdatedAt";
import type { SortOption } from "@/pages/hakijamaarat/lib/sortStatistics";

const PAGE_SIZE = 10;

const SEKTORI_LABELS: Record<string, string> = {
  Yliopistokoulutus: "Yliopisto",
  Ammattikorkeakoulukoulutus: "Ammattikorkeakoulu",
};

const SORT_VALUES = [
  "asc",
  "desc",
  "most_popular",
  "least_popular",
  "most_spots",
  "least_spots",
  "highest_acceptance_rate",
  "lowest_acceptance_rate",
] as const satisfies readonly SortOption[];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function stringSet(value: unknown) {
  return new Set(Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []);
}

function isYearOption(value: unknown): value is YearOption {
  return YEAR_OPTIONS.some((option) => option.value === value);
}

function isSortOption(value: unknown): value is SortOption {
  return typeof value === "string" && (SORT_VALUES as readonly string[]).includes(value);
}

export default function StatsListPage() {
  const ssrData = useData<HakijamaaratPageData>();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [selectedYear, setSelectedYear] = useState<YearOption>(CURRENT_YEAR);
  const [searchTerm, setSearchTerm] = useState("");
  const [compareSelection, setCompareSelection] = useState<StatisticsEntry[]>([]);
  const [selectedSektorit, setSelectedSektorit] = useState<Set<string>>(new Set());
  const [selectedKoulutusasteet, setSelectedKoulutusasteet] = useState<Set<string>>(new Set());
  const [selectedKoulutusalat, setSelectedKoulutusalat] = useState<Set<string>>(new Set());
  const [selectedKielet, setSelectedKielet] = useState<Set<string>>(new Set());
  const [selectedKunnat, setSelectedKunnat] = useState<Set<string>>(new Set());
  const [selectedSchools, setSelectedSchools] = useState<Set<string>>(new Set());
  const query = useStatisticsQuery(selectedYear, selectedYear === CURRENT_YEAR ? ssrData.statistics : undefined);

  const toggleCompare = useCallback((degree: StatisticsEntry) => {
    setCompareSelection((prev) =>
      prev.some((d) => d.kooditHakukohde === degree.kooditHakukohde)
        ? prev.filter((d) => d.kooditHakukohde !== degree.kooditHakukohde)
        : prev.length < 2
          ? [...prev, degree]
          : prev,
    );
  }, []);

  const sektoriCollection = useMemo(
    () =>
      toCollection(
        query.data?.map((d) => d.sektori),
        (s) => SEKTORI_LABELS[s] ?? s,
      ),
    [query.data],
  );
  const kuntaCollection = useMemo(() => toCollection(query.data?.map((d) => d.kuntaHakukohde)), [query.data]);
  const schoolCollection = useMemo(() => toCollection(query.data?.map((d) => d.korkeakoulu)), [query.data]);
  const koulutusasteCollection = useMemo(() => toCollection(query.data?.map((d) => d.koulutusasteTaso1)), [query.data]);
  const koulutusalaCollection = useMemo(() => toCollection(query.data?.map((d) => d.okmOhjauksenAla)), [query.data]);
  const kieliCollection = useMemo(() => toCollection(query.data?.map((d) => d.koulutuksenKieli)), [query.data]);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredData = useFilteredStatistics(
    query.data,
    debouncedSearchTerm,
    sortOrder,
    selectedSektorit,
    selectedKoulutusasteet,
    selectedKoulutusalat,
    selectedKielet,
    selectedKunnat,
    selectedSchools,
  );

  useWebMCP({
    name: "search_hakijamaarat",
    description:
      "Hakee ja suodattaa yhteishaun hakijamääriä. Asettaa sivun haun, vuoden ja suodattimet. Sektori: Yliopistokoulutus tai Ammattikorkeakoulukoulutus. Vuosi muodossa 2026_kevat.",
    inputSchema: {
      type: "object",
      properties: {
        haku: { type: "string", description: "Vapaa haku nimen tai koulun perusteella." },
        vuosi: { type: "string", enum: YEAR_OPTIONS.map((option) => option.value), description: "Tilastokierros, esimerkiksi 2026_kevat." },
        jarjestys: { type: "string", enum: [...SORT_VALUES] },
        sektori: { type: "array", items: { type: "string", enum: ["Yliopistokoulutus", "Ammattikorkeakoulukoulutus"] } },
        koulutusaste: { type: "array", items: { type: "string" } },
        koulutusala: { type: "array", items: { type: "string" } },
        kieli: { type: "array", items: { type: "string" } },
        kunta: { type: "array", items: { type: "string" } },
        koulu: { type: "array", items: { type: "string" } },
      },
    },
    execute: async (args: unknown) => {
      const input = isRecord(args) ? args : {};
      const year = isYearOption(input.vuosi) ? input.vuosi : selectedYear;
      const haku = typeof input.haku === "string" ? input.haku : "";
      const jarjestys = isSortOption(input.jarjestys) ? input.jarjestys : sortOrder;
      const sektorit = stringSet(input.sektori);
      const asteet = stringSet(input.koulutusaste);
      const alat = stringSet(input.koulutusala);
      const kielet = stringSet(input.kieli);
      const kunnat = stringSet(input.kunta);
      const koulut = stringSet(input.koulu);
      const data = await queryClient.ensureQueryData({
        queryKey: ["statistics", year],
        queryFn: () => getStatistics(year),
      });
      if (year !== selectedYear) setCompareSelection([]);
      setSelectedYear(year);
      setSearchTerm(haku);
      setSortOrder(jarjestys);
      setSelectedSektorit(sektorit);
      setSelectedKoulutusasteet(asteet);
      setSelectedKoulutusalat(alat);
      setSelectedKielet(kielet);
      setSelectedKunnat(kunnat);
      setSelectedSchools(koulut);
      setPage(1);
      const items = filterStatistics(data, haku, jarjestys, sektorit, asteet, alat, kielet, kunnat, koulut);
      return { year, total: items.length, items: items.map(toCompactStatistics) };
    },
  });

  const paginated = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const degreeSkeletonList = Array.from({ length: 10 }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: fixed loading placeholders have no identity or state
    <DegreeStatsCardSkeleton key={i} />
  ));

  const errorAlert = (
    <Alert.Root status="error">
      <Alert.Indicator />
      <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
    </Alert.Root>
  );

  const sidebar = (
    <Stack position={{ md: "sticky" }} width={{ base: "100%", md: "72" }}>
      <SearchInput
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Hae koulua tai linjaa"
        value={searchTerm}
      />
      <Accordion.Root multiple size="sm">
        <FilterItem
          collection={sektoriCollection}
          label="Sektori"
          onChange={selectFilter(setSelectedSektorit, () => setPage(1))}
          selected={selectedSektorit}
          value="sektori"
        />
        <FilterItem
          collection={koulutusasteCollection}
          label="Koulutusaste"
          onChange={selectFilter(setSelectedKoulutusasteet, () => setPage(1))}
          selected={selectedKoulutusasteet}
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
          collection={kieliCollection}
          label="Kieli"
          onChange={selectFilter(setSelectedKielet, () => setPage(1))}
          selected={selectedKielet}
          value="kieli"
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

  const sortYearControls = (
    <Group flex={1} gap={6} zIndex={10}>
      <SortControl
        onChange={(value) => {
          setSortOrder(value);
          setPage(1);
        }}
        value={sortOrder}
      />
      <YearControl
        onChange={(value) => {
          setSelectedYear(value);
          setPage(1);
          setCompareSelection([]);
          setSelectedSektorit(new Set());
          setSelectedKoulutusasteet(new Set());
          setSelectedKoulutusalat(new Set());
          setSelectedKielet(new Set());
          setSelectedKunnat(new Set());
          setSelectedSchools(new Set());
        }}
        value={selectedYear}
      />
    </Group>
  );

  const cardList = (
    <Stack
      as="ul"
      direction="column"
      gap={4}
      listStyleType="none"
      opacity={query.isPending ? 1 : query.isFetching ? 0.5 : 1}
      transition="opacity 0.15s"
    >
      {query.isPending ? degreeSkeletonList : null}
      {query.isError ? <Box as="li">{errorAlert}</Box> : null}
      {!query.isPending && !query.isError && paginated.length === 0 ? (
        <Text as="li">Ei tuloksia hakusanoilla.</Text>
      ) : null}
      {paginated.map((d) => (
        <DegreeStatsCard
          degree={d}
          isSelected={compareSelection.some((s) => s.kooditHakukohde === d.kooditHakukohde)}
          key={d.kooditHakukohde}
          onToggleCompare={toggleCompare}
          selectionFull={compareSelection.length === 2}
        />
      ))}
    </Stack>
  );

  return (
    <>
      <PageIntro
        description={
          <>
            Selaa korkeakoulujen yhteishaun hakijamääriä hakukohteittain.
            {ssrData.statisticsUpdatedAt ? (
              <>
                <br />
                Tiedot päivitetty: {formatStatisticsUpdatedAt(ssrData.statisticsUpdatedAt)} (seuraava 29.9.2026)
              </>
            ) : null}
          </>
        }
        title="Hakijamäärät"
      />
      <PageContainer align="flex-start">
        <Stack align="start" direction={{ base: "column", md: "row" }} gap={4}>
          {sidebar}

          <Stack flex={1} gap={4} width="100%">
            {sortYearControls}
            {!query.isPending && !query.isError ? (
              <Text color="fg.muted" fontSize="xs" ml="auto" mt={-3}>
                {filteredData.length} {filteredData.length === 1 ? "hakutulos" : "hakutulosta"}
              </Text>
            ) : null}
            {cardList}
            <Pagination count={filteredData.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
          </Stack>
        </Stack>

        {compareSelection.length > 0 ? <Box h="72px" /> : null}
      </PageContainer>
      <CompareBar onRemove={toggleCompare} selected={compareSelection} year={selectedYear} />
    </>
  );
}
