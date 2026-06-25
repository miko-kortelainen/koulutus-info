import { useState } from "react";
import { Alert, Card, Center, Heading, Stack } from "@chakra-ui/react";
import YearControl, { type YearOption } from "@/pages/hakijamaarat/components/YearControl";
import useStatisticsQuery from "@/pages/hakijamaarat/hooks/useStatisticsQuery";
import useTrendsData from "./hooks/useTrendsData";
import TopBarList from "./components/TopBarList";

export default function TrendsPage() {
  const [selectedYear, setSelectedYear] = useState<YearOption>("2026");
  const query = useStatisticsQuery(selectedYear);
  const trends = useTrendsData(query.data);

  return (
    <Center h="100%">
      <Stack direction="column" gap={8} px={{ base: 3, md: 8 }} py={4} width={{ base: "100%", md: "80%" }}>
        <Heading as="h1" size="md" srOnly>
          Trendit
        </Heading>

        <Stack direction="row" justifyContent="flex-end">
          <YearControl value={selectedYear} onChange={setSelectedYear} />
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

        <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="teal.solid">
          <Card.Body gap={4}>
            <Heading as="h2" size="sm">
              Suosituimmat koulutusalat
            </Heading>
            <TopBarList data={trends.topKoulutusalat} isLoading={query.isPending} color="teal.solid" />
          </Card.Body>
        </Card.Root>

        <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="blue.solid">
          <Card.Body gap={4}>
            <Heading as="h2" size="sm">
              Suosituimmat korkeakoulut
            </Heading>
            <TopBarList data={trends.topKorkeakoulut} isLoading={query.isPending} color="blue.solid" />
          </Card.Body>
        </Card.Root>

        <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor="purple.solid">
          <Card.Body gap={4}>
            <Heading as="h2" size="sm">
              Hakijat sektoreittain
            </Heading>
            <TopBarList data={trends.sektoriData} isLoading={query.isPending} color="purple.solid" label="Sektori" showPercent={false} />
          </Card.Body>
        </Card.Root>
      </Stack>
    </Center>
  );
}
