import { BarList, useChart, type BarListData } from "@chakra-ui/charts";
import { Skeleton, Stack, Text } from "@chakra-ui/react";

interface TopBarListProps {
  data: BarListData[];
  isLoading: boolean;
  color?: string;
  label?: string;
  showPercent?: boolean;
}

export default function TopBarList({ data, isLoading, color = "teal.solid", label = "Nimi", showPercent = true }: TopBarListProps) {
  const chart = useChart<BarListData>({
    data,
    sort: { by: "value", direction: "desc" },
    series: [{ name: "name", color }],
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
    <BarList.Root chart={chart} barSize="10">
      <BarList.Content>
        <BarList.Label title={label} flex="1">
          <BarList.Bar />
        </BarList.Label>
        <BarList.Label title="Hakijaa" minW={{ base: "20", md: "28" }} titleAlignment="end">
          <BarList.Value valueFormatter={(v) => new Intl.NumberFormat("fi-FI").format(v)} />
        </BarList.Label>
        {showPercent && (
          <BarList.Label title="%" minW="16" titleAlignment="end" display={{ base: "none", md: "flex" }}>
            <BarList.Value valueFormatter={(v) => `${chart.getValuePercent("value", v).toFixed(1)} %`} />
          </BarList.Label>
        )}
      </BarList.Content>
    </BarList.Root>
  );
}
