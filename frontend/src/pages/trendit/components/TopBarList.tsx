import type { BarListData } from "@chakra-ui/charts";
import { Badge, Box, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";

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
          <Skeleton borderRadius="md" height="40px" key={i} />
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

  const compareValueMap = compareData ? new Map(compareData.map((item) => [item.name, item.value])) : null;

  return (
    <Stack gap={0}>
      <Flex align="center" borderBottomWidth="1px" borderColor="border.subtle" gap={2} mb={1} pb={2}>
        <Box flexShrink={0} w="6" />
        <Box flex="1" />
        <Text color="fg.muted" flexShrink={0} fontSize="xs" fontWeight="medium" textAlign="right" w="16">
          {compareValueMap ? (selectedYear ?? "Nyt") : "Hakijaa"}
        </Text>
        {compareValueMap ? (
          <>
            <Text color="fg.muted" flexShrink={0} fontSize="xs" fontWeight="medium" textAlign="right" w="16">
              {compareYear ?? "Vertailu"}
            </Text>
            <Text
              color="fg.muted"
              display={{ base: "none", md: "block" }}
              flexShrink={0}
              fontSize="xs"
              fontWeight="medium"
              textAlign="right"
              w="20"
            >
              Muutos
            </Text>
          </>
        ) : (
          showPercent && (
            <Text
              color="fg.muted"
              display={{ base: "none", md: "block" }}
              flexShrink={0}
              fontSize="xs"
              fontWeight="medium"
              textAlign="right"
              w="16"
            >
              %
            </Text>
          )
        )}
      </Flex>

      {sorted.map((item, i) => {
        const name = item.name as string;
        const compareValue = compareValueMap?.get(name);
        const valueDiff = compareValue != null ? item.value - compareValue : null;

        return (
          <Flex align="center" gap={2} key={name} minH="10" py={1}>
            <Text color="fg.muted" flexShrink={0} fontSize="xs" textAlign="right" w="6">
              {i + 1}.
            </Text>
            <Box flex="1" minW={0}>
              <Text fontSize="sm" lineClamp={1} mb={1}>
                {name}
              </Text>
              <Box bg={color} borderRadius="sm" h={BAR_H} width={`${(item.value / maxValue) * 100}%`} />
            </Box>
            <Text flexShrink={0} fontSize="sm" textAlign="right" w="16">
              {fmt.format(item.value)}
            </Text>
            {compareValueMap ? (
              <>
                <Text color="fg.muted" flexShrink={0} fontSize="sm" textAlign="right" w="16">
                  {compareValue != null ? fmt.format(compareValue) : "–"}
                </Text>
                <Box display={{ base: "none", md: "block" }} flexShrink={0} textAlign="right" w="20">
                  {valueDiff != null ? (
                    <Badge
                      colorPalette={valueDiff > 0 ? "green" : valueDiff < 0 ? "red" : "gray"}
                      size="sm"
                      variant="subtle"
                    >
                      {valueDiff > 0 ? `+${fmt.format(valueDiff)}` : valueDiff < 0 ? fmt.format(valueDiff) : "–"}
                    </Badge>
                  ) : (
                    <Badge colorPalette="blue" size="sm" variant="subtle">
                      uusi
                    </Badge>
                  )}
                </Box>
              </>
            ) : (
              showPercent && (
                <Text
                  color="fg.muted"
                  display={{ base: "none", md: "block" }}
                  flexShrink={0}
                  fontSize="sm"
                  textAlign="right"
                  w="16"
                >
                  {((item.value / total) * 100).toFixed(1)} %
                </Text>
              )
            )}
          </Flex>
        );
      })}
    </Stack>
  );
}
