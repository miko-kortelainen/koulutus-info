import { BarList, useChart, type BarListData } from "@chakra-ui/charts";
import { Skeleton, Stack, Text } from "@chakra-ui/react";

interface SektoriDonutChartProps {
  data: { name: string; value: number }[];
  isLoading: boolean;
}

export default function SektoriDonutChart({ data, isLoading }: SektoriDonutChartProps) {
  const chart = useChart<BarListData>({
    data,
    sort: { by: "value", direction: "desc" },
    series: [{ name: "name", color: "purple.solid" }],
  });

  if (isLoading) {
    return (
      <Stack gap={2}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="40px" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (data.length === 0) {
    return <Text color="fg.muted">Ei tietoja saatavilla.</Text>;
  }

  return (
    <BarList.Root chart={chart}>
      <BarList.Content>
        <BarList.Label title="Sektori" flex="1">
          <BarList.Bar />
        </BarList.Label>
        <BarList.Label title="Hakijaa" minW={{ base: "20", md: "28" }} titleAlignment="end">
          <BarList.Value valueFormatter={(v) => new Intl.NumberFormat("fi-FI").format(v)} />
        </BarList.Label>
      </BarList.Content>
    </BarList.Root>
  );
}
