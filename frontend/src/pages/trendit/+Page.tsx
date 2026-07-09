import { Alert, Box, createListCollection, Heading, Select, Stack, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import PageContainer from "@/layout/PageContainer";
import YearControl from "@/pages/hakijamaarat/components/YearControl";
import { CURRENT_YEAR, YEAR_OPTIONS, type YearOption } from "@/pages/hakijamaarat/components/yearOptions";
import type { StatisticsResponse } from "@/types.gen";
import { FIELD_COLOR, SCHOOL_COLOR, SECTOR_COLOR, TREND_COLOR } from "./colors";
import KoulutusalaTrendChart from "./components/KoulutusalaTrendChart";
import TopBarList from "./components/TopBarList";
import TrendCard from "./components/TrendCard";
import { useKoulutusalaTrends } from "./hooks/useKoulutusalaTrends";
import useTrendsData from "./hooks/useTrendsData";

export default function TrendsPage() {
  const ssrData = useData<StatisticsResponse>();
  const [selectedYear, setSelectedYear] = useState<YearOption>(CURRENT_YEAR);
  const [compareYear, setCompareYear] = useState<YearOption | "">("");

  const compareCollection = useMemo(
    () =>
      createListCollection({
        items: [{ label: "Ei vertailua", value: "" }, ...YEAR_OPTIONS.filter((y) => y.value !== selectedYear)],
      }),
    [selectedYear],
  );

  const query = useStatisticsQuery(selectedYear, selectedYear === CURRENT_YEAR ? ssrData : undefined);
  const compareQuery = useStatisticsQuery(compareYear as YearOption, undefined, !!compareYear);

  const koulutusalaTrends = useKoulutusalaTrends(ssrData);
  const trends = useTrendsData(query.data);
  const compareTrends = useTrendsData(compareYear ? compareQuery.data : undefined, 0);

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Trendit
      </Heading>
      <Text color="fg.muted">Vertaile koulutusalojen ja korkeakoulujen hakijamääriä.</Text>
    </Stack>
  );

  const loadingAndError = (
    <div aria-atomic="true" aria-live="polite">
      {query.isPending && <span className="sr-only">Ladataan tilastoja...</span>}
      {query.isError && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
        </Alert.Root>
      )}
    </div>
  );

  const comparator = (
    <Box flex={1}>
      <Text color="fg.muted" fontSize="xs" mb={1}>
        Vuosi
      </Text>
      <YearControl
        onChange={(y) => {
          setSelectedYear(y);
          if (compareYear === y) setCompareYear("");
        }}
        value={selectedYear}
      />
    </Box>
  );

  const comparand = (
    <Box flex={1}>
      <Text color="fg.muted" fontSize="xs" mb={1}>
        Vertailukohde
      </Text>
      <Select.Root
        collection={compareCollection}
        onValueChange={(e) => setCompareYear(e.value[0] as YearOption | "")}
        size="sm"
        value={[compareYear]}
      >
        <Select.HiddenSelect aria-label="Vertailuvuosi" />
        <Select.Control>
          <Select.Trigger aria-label="Vertailuvuosi">
            <Select.ValueText placeholder="Vertaa vuoteen..." />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            {compareCollection.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Box>
  );

  const applicantsByField = (
    <TrendCard color={FIELD_COLOR} title="Suosituimmat koulutusalat">
      <TopBarList
        color={FIELD_COLOR}
        compareData={compareYear ? compareTrends.topKoulutusalat : undefined}
        compareYear={compareYear || undefined}
        data={trends.topKoulutusalat}
        isLoading={query.isPending}
        selectedYear={selectedYear}
        skeletonCount={10}
      />
    </TrendCard>
  );

  const applicantsBySchool = (
    <TrendCard color={SCHOOL_COLOR} title="Suosituimmat korkeakoulut">
      <TopBarList
        color={SCHOOL_COLOR}
        compareData={compareYear ? compareTrends.topKorkeakoulut : undefined}
        compareYear={compareYear || undefined}
        data={trends.topKorkeakoulut}
        isLoading={query.isPending}
        selectedYear={selectedYear}
        skeletonCount={10}
      />
    </TrendCard>
  );

  const applicantsBySector = (
    <TrendCard color={SECTOR_COLOR} title="Hakijat sektoreittain">
      <TopBarList
        color={SECTOR_COLOR}
        compareData={compareYear ? compareTrends.sektoriData : undefined}
        compareYear={compareYear || undefined}
        data={trends.sektoriData}
        isLoading={query.isPending}
        selectedYear={selectedYear}
        showPercent={false}
      />
    </TrendCard>
  );

  const applicantsByYear = (
    <TrendCard color={TREND_COLOR} title="Hakijamäärien trendi">
      <KoulutusalaTrendChart
        chartData={koulutusalaTrends.chartData}
        color={TREND_COLOR}
        isLoading={koulutusalaTrends.isLoading}
      />
    </TrendCard>
  );

  const yearSelectors = (
    <Stack gap={4}>
      <Stack align="flex-end" direction="row" gap={2} justifyContent="flex-end">
        {comparator}
        {comparand}
      </Stack>
    </Stack>
  );

  return (
    <PageContainer>
      {header}
      {loadingAndError}
      {yearSelectors}

      {applicantsByField}
      {applicantsBySchool}
      {applicantsBySector}
      {applicantsByYear}
    </PageContainer>
  );
}
