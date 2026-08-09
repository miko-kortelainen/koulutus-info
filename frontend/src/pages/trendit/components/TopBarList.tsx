import { Box, Flex, Skeleton, Stack, Text } from "@chakra-ui/react";
import { numberFormat } from "@/lib/statistics";

interface BarListData {
  name: string;
  value: number;
}

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

interface SeriesBarProps {
  color: string;
  label: string;
  maxValue: number;
  name: string;
  value: number | null;
}

const BAR_H = "4";
const percentFormat = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function roundLabel(label: string) {
  return label.charAt(0).toLocaleUpperCase("fi") + label.slice(1);
}

function SeriesBar({ color, label, maxValue, name, value }: SeriesBarProps) {
  const displayLabel = roundLabel(label);

  return (
    <Box>
      <Flex align="baseline" gap={3} justify="space-between" mb={value != null ? 1 : 0}>
        <Text color="fg.muted" fontSize="sm" lineClamp={1}>
          {displayLabel}
        </Text>
        <Text flexShrink={0} fontSize="sm" fontVariantNumeric="tabular-nums">
          {value != null ? numberFormat.format(value) : "–"}
        </Text>
      </Flex>
      {value != null ? (
        <Box bg="bg.muted" borderRadius="sm" h={BAR_H} overflow="hidden" w="100%">
          <Box
            aria-label={`${name}, ${displayLabel}`}
            aria-valuemax={maxValue}
            aria-valuemin={0}
            aria-valuenow={value}
            bg={color}
            h="100%"
            role="meter"
            w={`${(value / maxValue) * 100}%`}
          />
        </Box>
      ) : null}
    </Box>
  );
}

export default function TopBarList({
  data,
  isLoading,
  color = "accent",
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
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed loading placeholders have no identity or state
          <Skeleton borderRadius="md" height="40px" key={i} />
        ))}
      </Stack>
    );
  }

  if (data.length === 0) {
    return <Text color="fg.muted">Ei tietoja saatavilla.</Text>;
  }

  const sorted = [...data].sort((a, b) => b.value - a.value);
  const compareValueMap = compareData ? new Map(compareData.map((item) => [item.name, item.value])) : null;
  const maxValue = Math.max(
    1,
    ...sorted.map((item) => item.value),
    ...(compareValueMap ? sorted.map((item) => compareValueMap.get(item.name) ?? 0) : []),
  );
  const total = sorted.reduce((sum, d) => sum + d.value, 0);
  const compareFill = `color-mix(in oklch, ${color} 45%, var(--chakra-colors-bg))`;

  if (compareValueMap && selectedYear && compareYear) {
    return (
      <Stack gap={5}>
        {sorted.map((item) => {
          const name = item.name;
          const compareValue = compareValueMap.get(name) ?? null;

          return (
            <Stack gap={2} key={name}>
              <Text fontSize="sm" fontWeight="medium" lineClamp={2}>
                {name}
              </Text>
              <SeriesBar color={color} label={selectedYear} maxValue={maxValue} name={name} value={item.value} />
              <SeriesBar color={compareFill} label={compareYear} maxValue={maxValue} name={name} value={compareValue} />
            </Stack>
          );
        })}
      </Stack>
    );
  }

  return (
    <Stack gap={3}>
      <Flex align="center" borderBottomWidth="1px" borderColor="border.subtle" gap={2} pb={2}>
        <Box flex="1" />
        <Text color="fg.muted" flexShrink={0} fontSize="xs" fontWeight="medium" textAlign="right" w="16">
          Hakijaa
        </Text>
        {showPercent && (
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
        )}
      </Flex>

      {sorted.map((item) => {
        const name = item.name;

        return (
          <Flex align="center" gap={2} key={name} minH="10" py={1.5}>
            <Box flex="1" minW={0}>
              <Text fontSize="sm" lineClamp={1} mb={1}>
                {name}
              </Text>
              <Box bg="bg.muted" borderRadius="sm" h={BAR_H} overflow="hidden" w="100%">
                <Box
                  aria-label={name}
                  aria-valuemax={maxValue}
                  aria-valuemin={0}
                  aria-valuenow={item.value}
                  bg={color}
                  h="100%"
                  role="meter"
                  w={`${(item.value / maxValue) * 100}%`}
                />
              </Box>
            </Box>
            <Text flexShrink={0} fontSize="sm" fontVariantNumeric="tabular-nums" textAlign="right" w="16">
              {numberFormat.format(item.value)}
            </Text>
            {showPercent && (
              <Text
                color="fg.muted"
                display={{ base: "none", md: "block" }}
                flexShrink={0}
                fontSize="sm"
                fontVariantNumeric="tabular-nums"
                textAlign="right"
                w="16"
              >
                {total > 0 ? `${percentFormat.format((item.value / total) * 100)} %` : "–"}
              </Text>
            )}
          </Flex>
        );
      })}
    </Stack>
  );
}
