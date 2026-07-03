import { useMemo, useState } from "react";
import { Alert, Box, Card, Heading, Select, Stack, Text, createListCollection } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import YearControl from "@/pages/hakijamaarat/components/YearControl";
import { type YearOption, YEAR_OPTIONS } from "@/pages/hakijamaarat/components/yearOptions";
import useStatisticsQuery from "@/pages/hakijamaarat/hooks/useStatisticsQuery";
import useTrendsData from "./hooks/useTrendsData";
import { useKoulutusalaTrends } from "./hooks/useKoulutusalaTrends";
import TopBarList from "./components/TopBarList";
import KoulutusalaTrendChart from "./components/KoulutusalaTrendChart";
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

  return (
    <PageContainer>
      <Stack gap={1}>
        <Heading as="h1" size="lg">
          Trendit
        </Heading>
        <Text color="fg.muted">Vertaile koulutusalojen ja korkeakoulujen hakijamääriä.</Text>
      </Stack>

      <div aria-live="polite" aria-atomic="true">
        {query.isPending && <span className="sr-only">Ladataan tilastoja...</span>}
        {query.isError && (
          <Alert.Root status="error">
            <Alert.Indicator />
            <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
          </Alert.Root>
        )}
      </div>

      <Stack gap={4}>
        <Stack direction="row" justifyContent="flex-end" gap={2} align="flex-end">
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
        </Stack>

        <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="green.solid">
          <Card.Body gap={4}>
            <Heading as="h2" size="sm">
              Suosituimmat koulutusalat
            </Heading>
            <TopBarList
              data={trends.topKoulutusalat}
              isLoading={query.isPending}
              color="green.solid"
              skeletonCount={10}
              compareData={compareYear ? compareTrends.topKoulutusalat : undefined}
              selectedYear={selectedYear}
              compareYear={compareYear || undefined}
            />
          </Card.Body>
        </Card.Root>
      </Stack>

      <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="blue.solid">
        <Card.Body gap={4}>
          <Heading as="h2" size="sm">
            Suosituimmat korkeakoulut
          </Heading>
          <TopBarList
            data={trends.topKorkeakoulut}
            isLoading={query.isPending}
            color="blue.solid"
            skeletonCount={10}
            compareData={compareYear ? compareTrends.topKorkeakoulut : undefined}
            selectedYear={selectedYear}
            compareYear={compareYear || undefined}
          />
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="purple.solid">
        <Card.Body gap={4}>
          <Heading as="h2" size="sm">
            Hakijat sektoreittain
          </Heading>
          <TopBarList
            data={trends.sektoriData}
            isLoading={query.isPending}
            color="purple.solid"
            showPercent={false}
            compareData={compareYear ? compareTrends.sektoriData : undefined}
            selectedYear={selectedYear}
            compareYear={compareYear || undefined}
          />
        </Card.Body>
      </Card.Root>

      <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="teal.solid">
        <Card.Body gap={4}>
          <Heading as="h2" size="sm">
            Hakijamäärien trendit koulutusaloittain
          </Heading>
          <KoulutusalaTrendChart
            chartData={koulutusalaTrends.chartData}
            topByGrowth={koulutusalaTrends.topByGrowth}
            isLoading={koulutusalaTrends.isLoading}
          />
        </Card.Body>
      </Card.Root>
    </PageContainer>
  );
}
