import { Badge, Box, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import type { BarListData } from "@chakra-ui/charts";

interface TopBarListProps {
  data: BarListData[];
  isLoading: boolean;
  color?: string;
  showPercent?: boolean;
  skeletonCount?: number;
  compareData?: BarListData[];
  selectedYear?: string;
  compareYear?: string;
}

const fmt = new Intl.NumberFormat("fi-FI");
const BAR_H = "2";

export default function TopBarList({
  data,
  isLoading,
  color = "blue.solid",
  showPercent = true,
  skeletonCount = 5,
  compareData,
  selectedYear,
  compareYear,
}: TopBarListProps) {
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

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const maxValue = sorted[0]?.value ?? 1;
  const total = sorted.reduce((sum, d) => sum + d.value, 0);

  const compareValueMap = compareData
    ? new Map(compareData.map((item) => [item.name, item.value]))
    : null;

  return (
    <Stack gap={0}>
      <Flex align="center" gap={2} pb={2} mb={1} borderBottomWidth="1px" borderColor="border.subtle">
        <Box w="6" flexShrink={0} />
        <Box flex="1" />
        <Text fontSize="xs" color="fg.muted" w="16" textAlign="right" flexShrink={0} fontWeight="medium">
          {compareValueMap ? (selectedYear ?? "Nyt") : "Hakijaa"}
        </Text>
        {compareValueMap ? (
          <>
            <Text fontSize="xs" color="fg.muted" w="16" textAlign="right" flexShrink={0} fontWeight="medium" display={{ base: "none", md: "block" }}>
              {compareYear ?? "Vertailu"}
            </Text>
            <Text fontSize="xs" color="fg.muted" w="20" textAlign="right" flexShrink={0} fontWeight="medium">
              Muutos
            </Text>
          </>
        ) : showPercent && (
          <Text fontSize="xs" color="fg.muted" w="16" textAlign="right" flexShrink={0} fontWeight="medium" display={{ base: "none", md: "block" }}>
            %
          </Text>
        )}
      </Flex>

      {sorted.map((item, i) => {
        const name = item.name as string;
        const compareValue = compareValueMap?.get(name);
        const valueDiff = compareValue != null ? item.value - compareValue : null;

        return (
          <Flex key={name} align="center" gap={2} minH="10" py={1}>
                <Text w="6" textAlign="right" fontSize="xs" color="fg.muted" flexShrink={0}>
              {i + 1}.
            </Text>
            <Box flex="1" minW={0}>
              <Text fontSize="sm" lineClamp={1} mb={1}>{name}</Text>
              <Box bg={color} h={BAR_H} borderRadius="sm" width={`${(item.value / maxValue) * 100}%`} />
            </Box>
            <Text fontSize="sm" textAlign="right" w="16" flexShrink={0}>
              {fmt.format(item.value)}
            </Text>
            {compareValueMap ? (
              <>
                <Text fontSize="sm" textAlign="right" w="16" flexShrink={0} color="fg.muted" display={{ base: "none", md: "block" }}>
                  {compareValue != null ? fmt.format(compareValue) : "–"}
                </Text>
                <Box w="20" flexShrink={0} textAlign="right">
                  {valueDiff != null ? (
                    <Badge size="sm" colorPalette={valueDiff > 0 ? "green" : valueDiff < 0 ? "red" : "gray"} variant="subtle">
                      {valueDiff > 0 ? `+${fmt.format(valueDiff)}` : valueDiff < 0 ? fmt.format(valueDiff) : "–"}
                    </Badge>
                  ) : (
                    <Badge size="sm" colorPalette="blue" variant="subtle">uusi</Badge>
                  )}
                </Box>
              </>
            ) : showPercent && (
              <Text fontSize="sm" textAlign="right" w="16" flexShrink={0} color="fg.muted" display={{ base: "none", md: "block" }}>
                {((item.value / total) * 100).toFixed(1)} %
              </Text>
            )}
          </Flex>
        );
      })}
    </Stack>
  );
}
