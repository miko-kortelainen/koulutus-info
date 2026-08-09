import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import type { HakijaprofiiliCount } from "@/api/dataValidation";
import { formatCount } from "@/lib/statistics";
import { isPublishableCount, shareOf } from "@/pages/hakijaprofiili/lib/masking";

interface ProfiliBarListProps {
  ariaLabel: string;
  rows: HakijaprofiiliCount[];
  /** Null when shares must stay hidden (any part masked or under five). */
  total: number | null;
  /** Defaults to alle 5 / formatCount. Sukupuoli passes formatGenderCount. */
  formatCountLabel?: (lkm: number | null) => string;
}

const BAR_H = "8";
const defaultCountLabel = (lkm: number | null) => (isPublishableCount(lkm) ? formatCount(lkm) : "alle 5");

export default function ProfiliBarList({
  ariaLabel,
  rows,
  total,
  formatCountLabel = defaultCountLabel,
}: ProfiliBarListProps) {
  if (rows.length === 0) {
    return <Text color="fg.muted">Ei tietoja saatavilla.</Text>;
  }

  const publishedLkms = rows.map((row) => row.lkm).filter(isPublishableCount);
  const maxValue = publishedLkms.length > 0 ? Math.max(...publishedLkms, 1) : null;

  return (
    <Stack aria-label={ariaLabel} as="ul" gap={3} listStyleType="none" m={0} p={0} role="list">
      {rows.map((row) => {
        const countLabel = formatCountLabel(row.lkm);
        const publishedLkm = isPublishableCount(row.lkm) ? row.lkm : null;
        const shareLabel = total != null && publishedLkm != null ? shareOf(publishedLkm, total) : null;
        const barWidth = publishedLkm != null && maxValue != null ? `${(publishedLkm / maxValue) * 100}%` : null;

        return (
          <Flex as="li" gap={3} key={row.nimi} minH="10" py={1.5} role="listitem">
            <Box flex="1" minW={0}>
              <Flex align="baseline" gap={3} justify="space-between" mb={barWidth != null ? 1 : 0}>
                <Text fontSize="sm" lineClamp={2}>
                  {row.nimi}
                </Text>
                <Flex flexShrink={0} gap={3}>
                  <Text fontSize="sm" fontVariantNumeric="tabular-nums" textAlign="end">
                    {countLabel}
                  </Text>
                  {shareLabel != null ? (
                    <Text
                      color="fg.muted"
                      fontSize="sm"
                      fontVariantNumeric="tabular-nums"
                      minW="4.5rem"
                      textAlign="end"
                    >
                      {shareLabel}
                    </Text>
                  ) : null}
                </Flex>
              </Flex>
              {barWidth != null && publishedLkm != null ? (
                <Box bg="bg.muted" borderRadius="sm" h={BAR_H} overflow="hidden" w="100%">
                  <Box
                    aria-label={row.nimi}
                    aria-valuemax={maxValue ?? 0}
                    aria-valuemin={0}
                    aria-valuenow={publishedLkm}
                    bg="accent"
                    h="100%"
                    role="meter"
                    w={barWidth}
                  />
                </Box>
              ) : null}
            </Box>
          </Flex>
        );
      })}
    </Stack>
  );
}
