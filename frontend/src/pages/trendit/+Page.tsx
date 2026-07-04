import { useMemo, useState } from "react";
import { Alert, Box, Heading, Select, Stack, Text, createListCollection } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import YearControl from "@/pages/hakijamaarat/components/YearControl";
import { type YearOption, YEAR_OPTIONS } from "@/pages/hakijamaarat/components/yearOptions";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import useTrendsData from "./hooks/useTrendsData";
import { useKoulutusalaTrends } from "./hooks/useKoulutusalaTrends";
import TopBarList from "./components/TopBarList";
import KoulutusalaTrendChart from "./components/KoulutusalaTrendChart";
import TrendCard from "./components/TrendCard";
import type { StatisticsResponse } from "@/types.gen";

export default function TrendsPage() {
  const ssrData = useData<StatisticsResponse>();
  const [selectedYear, setSelectedYear] = useState<YearOption>("2026");
  const [compareYear, setCompareYear] = useState<YearOption | "">("");

  const compareCollection = useMemo(
    () =>
      createListCollection({
        items: [{ label: "Ei vertailua", value: "" }, ...YEAR_OPTIONS.filter((y) => y.value !== selectedYear)],
      }),
    [selectedYear],
  );

  const query = useStatisticsQuery(selectedYear, selectedYear === "2026" ? ssrData : undefined);
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
    <div aria-live="polite" aria-atomic="true">
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
      <Text fontSize="xs" color="fg.muted" mb={1}>
        Vuosi
      </Text>
      <YearControl
        value={selectedYear}
        onChange={(y) => {
          setSelectedYear(y);
          if (compareYear === y) setCompareYear("");
        }}
      />
    </Box>
  );

  const comparand = (
    <Box flex={1}>
      <Text fontSize="xs" color="fg.muted" mb={1}>
        Vertailukohde
      </Text>
      <Select.Root
        size="sm"
        collection={compareCollection}
        value={[compareYear]}
        onValueChange={(e) => setCompareYear(e.value[0] as YearOption | "")}
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
              <Select.Item key={option.value} item={option}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
    </Box>
  );

  const applicantsByField = (
    <TrendCard title="Suosituimmat koulutusalat" color="green.solid">
      <TopBarList
        data={trends.topKoulutusalat}
        isLoading={query.isPending}
        color="green.solid"
        skeletonCount={10}
        compareData={compareYear ? compareTrends.topKoulutusalat : undefined}
        selectedYear={selectedYear}
        compareYear={compareYear || undefined}
      />
    </TrendCard>
  );

  const applicantsBySchool = (
    <TrendCard title="Suosituimmat korkeakoulut" color="blue.solid">
      <TopBarList
        data={trends.topKorkeakoulut}
        isLoading={query.isPending}
        color="blue.solid"
        skeletonCount={10}
        compareData={compareYear ? compareTrends.topKorkeakoulut : undefined}
        selectedYear={selectedYear}
        compareYear={compareYear || undefined}
      />
    </TrendCard>
  );

  const applicantsBySector = (
    <TrendCard title="Hakijat sektoreittain" color="purple.solid">
      <TopBarList
        data={trends.sektoriData}
        isLoading={query.isPending}
        color="purple.solid"
        showPercent={false}
        compareData={compareYear ? compareTrends.sektoriData : undefined}
        selectedYear={selectedYear}
        compareYear={compareYear || undefined}
      />
    </TrendCard>
  );

  const applicantsByYear = (
    <TrendCard title="Hakijamäärien trendit koulutusaloittain" color="teal.solid">
      <KoulutusalaTrendChart
        chartData={koulutusalaTrends.chartData}
        topByGrowth={koulutusalaTrends.topByGrowth}
        isLoading={koulutusalaTrends.isLoading}
      />
    </TrendCard>
  );

  const yearSelectors = (
    <Stack gap={4}>
      <Stack direction="row" justifyContent="flex-end" gap={2} align="flex-end">
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
