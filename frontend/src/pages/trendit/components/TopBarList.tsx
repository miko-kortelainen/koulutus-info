import { BarList, useChart, type BarListData } from "@chakra-ui/charts";
import { Badge, Box, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";

interface TopBarListProps {
  data: BarListData[];
  isLoading: boolean;
  color?: string;
  label?: string;
  showPercent?: boolean;
  skeletonCount?: number;
  compareData?: BarListData[];
  selectedYear?: string;
  compareYear?: string;
}

const fmt = new Intl.NumberFormat("fi-FI");

function CompareTable({
  data,
  compareData,
  color,
  selectedYear,
  compareYear,
}: {
  data: BarListData[];
  compareData: BarListData[];
  color: string;
  selectedYear?: string;
  compareYear?: string;
}) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  const maxValue = sorted[0]?.value ?? 1;
  const compareValueMap = new Map(compareData.map((item) => [item.name, item.value]));

  return (
    <Stack gap={0}>
      <Flex align="center" gap={2} pb={2} mb={1} borderBottomWidth="1px" borderColor="border.subtle">
        <Box w="6" flexShrink={0} />
        <Box flex="1" />
        <Text fontSize="xs" color="fg.muted" w="16" textAlign="right" flexShrink={0} fontWeight="medium">
          {selectedYear ?? "Nyt"}
        </Text>
        <Text
          fontSize="xs"
          color="fg.muted"
          w="16"
          textAlign="right"
          flexShrink={0}
          fontWeight="medium"
          display={{ base: "none", md: "block" }}
        >
          {compareYear ?? "Vertailu"}
        </Text>
        <Text fontSize="xs" color="fg.muted" w="20" textAlign="right" flexShrink={0} fontWeight="medium">
          Muutos
        </Text>
      </Flex>

      {sorted.map((item, i) => {
        const currentRank = i + 1;
        const compareValue = compareValueMap.get(item.name as string);
        const valueDiff = compareValue != null ? item.value - compareValue : null;

        return (
          <Flex key={item.name as string} align="center" gap={2} minH="10" py={1}>
            <Text w="6" textAlign="right" fontSize="xs" color="fg.muted" flexShrink={0}>
              {currentRank}.
            </Text>
            <Box flex="1" minW={0}>
              <Text fontSize="sm" lineClamp={1} mb={1}>
                {item.name as string}
              </Text>
              <Box bg={color} height="6px" borderRadius="sm" width={`${(item.value / maxValue) * 100}%`} />
            </Box>
            <Text fontSize="sm" textAlign="right" w="16" flexShrink={0}>
              {fmt.format(item.value)}
            </Text>
            <Text
              fontSize="sm"
              textAlign="right"
              w="16"
              flexShrink={0}
              color="fg.muted"
              display={{ base: "none", md: "block" }}
            >
              {compareValue != null ? fmt.format(compareValue) : "–"}
            </Text>
            <Box w="20" flexShrink={0} textAlign="right">
              {valueDiff != null ? (
                <Badge
                  size="sm"
                  colorPalette={valueDiff > 0 ? "green" : valueDiff < 0 ? "red" : "gray"}
                  variant="subtle"
                >
                  {valueDiff > 0 ? `+${fmt.format(valueDiff)}` : valueDiff < 0 ? fmt.format(valueDiff) : "–"}
                </Badge>
              ) : (
                <Badge size="sm" colorPalette="blue" variant="subtle">
                  uusi
                </Badge>
              )}
            </Box>
          </Flex>
        );
      })}
    </Stack>
  );
}

export default function TopBarList({
  data,
  isLoading,
  color = "teal.solid",
  label = "Nimi",
  showPercent = true,
  skeletonCount = 5,
  compareData,
  selectedYear,
  compareYear,
}: TopBarListProps) {
  const chart = useChart<BarListData>({
    data,
    sort: { by: "value", direction: "desc" },
    series: [{ name: "name", color }],
  });

  if (isLoading) {
    return (
      <Stack gap={2}>
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} height="40px" borderRadius="md" />
        ))}
      </Stack>
    );
  }

  if (data.length === 0) {
    return <Text color="fg.muted">Ei tietoja saatavilla.</Text>;
  }

  if (compareData) {
    return (
      <CompareTable
        data={data}
        compareData={compareData}
        color={color}
        selectedYear={selectedYear}
        compareYear={compareYear}
      />
    );
  }

  return (
    <BarList.Root chart={chart} barSize="10">
      <BarList.Content>
        <BarList.Label title={label} flex="1">
          <BarList.Bar />
        </BarList.Label>
        <BarList.Label title="Hakijaa" minW={{ base: "20", md: "28" }} titleAlignment="end">
          <BarList.Value valueFormatter={(v) => fmt.format(v)} />
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
