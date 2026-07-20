import { Alert, Box, createListCollection, Heading, Select, Stack, Text, VisuallyHidden } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import YearControl from "@/components/YearControl";
import { CURRENT_YEAR, statisticsRoundShortLabel, YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";
import useStatisticsQuery from "@/hooks/useStatisticsQuery";
import PageContainer from "@/layout/PageContainer";
import type { TrendsPageData } from "./+data";
import { FIELD_COLOR, SCHOOL_COLOR, SECTOR_COLOR, TREND_COLOR } from "./colors";
import ApplicantTotalsChart from "./components/ApplicantTotalsChart";
import TopBarList from "./components/TopBarList";
import TrendCard from "./components/TrendCard";
import useTrendsData from "./hooks/useTrendsData";

export default function TrendsPage() {
  const { autumnTotals, currentStatistics, springTotals } = useData<TrendsPageData>();
  const [selectedYear, setSelectedYear] = useState<YearOption>(CURRENT_YEAR);
  const [compareYear, setCompareYear] = useState<YearOption | "">("");

  const compareCollection = useMemo(
    () =>
      createListCollection({
        items: [{ label: "Ei vertailua", value: "" }, ...YEAR_OPTIONS.filter((y) => y.value !== selectedYear)],
      }),
    [selectedYear],
  );

  const query = useStatisticsQuery(selectedYear, selectedYear === CURRENT_YEAR ? currentStatistics : undefined);
  const compareQuery = useStatisticsQuery(compareYear as YearOption, undefined, !!compareYear);

  const primaryReady = query.isSuccess;
  const comparisonReady = Boolean(compareYear && compareQuery.isSuccess);
  const trends = useTrendsData(primaryReady ? query.data : undefined);
  const compareTrends = useTrendsData(comparisonReady ? compareQuery.data : undefined, 0);
  const listsAreLoading = query.isPending || Boolean(compareYear && compareQuery.isPending);

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
      {query.isPending && <VisuallyHidden>Ladataan tilastoja...</VisuallyHidden>}
      {query.isError && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
        </Alert.Root>
      )}
      {compareYear && compareQuery.isError && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Vertailutietojen lataaminen epäonnistui.</Alert.Title>
        </Alert.Root>
      )}
    </div>
  );

  const comparator = (
    <Box flex={1}>
      <Text color="fg.muted" fontSize="xs" mb={1}>
        Yhteishaku
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
        <Select.HiddenSelect aria-label="Vertailuyhteishaku" />
        <Select.Control>
          <Select.Trigger aria-label="Vertailuyhteishaku">
            <Select.ValueText placeholder="Vertaa yhteishakuun..." />
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
        compareData={comparisonReady ? compareTrends.topKoulutusalat : undefined}
        compareYear={comparisonReady ? statisticsRoundShortLabel(compareYear as YearOption) : undefined}
        data={trends.topKoulutusalat}
        isLoading={listsAreLoading}
        selectedYear={statisticsRoundShortLabel(selectedYear)}
        skeletonCount={10}
      />
    </TrendCard>
  );

  const applicantsBySchool = (
    <TrendCard color={SCHOOL_COLOR} title="Suosituimmat korkeakoulut">
      <TopBarList
        color={SCHOOL_COLOR}
        compareData={comparisonReady ? compareTrends.topKorkeakoulut : undefined}
        compareYear={comparisonReady ? statisticsRoundShortLabel(compareYear as YearOption) : undefined}
        data={trends.topKorkeakoulut}
        isLoading={listsAreLoading}
        selectedYear={statisticsRoundShortLabel(selectedYear)}
        skeletonCount={10}
      />
    </TrendCard>
  );

  const applicantsBySector = (
    <TrendCard color={SECTOR_COLOR} title="Hakijat sektoreittain">
      <TopBarList
        color={SECTOR_COLOR}
        compareData={comparisonReady ? compareTrends.sektoriData : undefined}
        compareYear={comparisonReady ? statisticsRoundShortLabel(compareYear as YearOption) : undefined}
        data={trends.sektoriData}
        isLoading={listsAreLoading}
        selectedYear={statisticsRoundShortLabel(selectedYear)}
        showPercent={false}
      />
    </TrendCard>
  );

  const applicantsByYear = (
    <>
      <TrendCard color={TREND_COLOR} title="Kevään 1. ja 2. yhteishaun hakijamäärät">
        <ApplicantTotalsChart
          chartData={springTotals}
          color={TREND_COLOR}
          title="Kevään yhteishakujen ensisijaiset hakijat vuosittain"
        />
      </TrendCard>
      <TrendCard color={TREND_COLOR} title="Syksyn yhteishaun hakijamäärät">
        <ApplicantTotalsChart
          chartData={autumnTotals}
          color={TREND_COLOR}
          title="Syksyn yhteishaun ensisijaiset hakijat vuosittain"
        />
      </TrendCard>
    </>
  );

  const yearSelectors = (
    <Stack gap={4}>
      <Stack align="flex-end" direction="row" gap={6} justifyContent="flex-end">
        {comparator}
        {comparand}
      </Stack>
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
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
