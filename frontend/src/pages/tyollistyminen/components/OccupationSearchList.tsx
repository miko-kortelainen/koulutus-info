import { Box, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { AmmattiPalkkaItem } from "@/api/dataValidation";
import Pagination from "@/components/Pagination";
import { numberFormat } from "@/lib/statistics";

interface OccupationSearchListProps {
  items: AmmattiPalkkaItem[];
  maxSalary: number;
  page: number;
  onPageChange: (page: number) => void;
}

const PAGE_SIZE = 15;

export default function OccupationSearchList({ items, maxSalary, page, onPageChange }: OccupationSearchListProps) {
  if (items.length === 0) return null;

  const paginated = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Stack as="section" gap={3} width="full">
      <Heading as="h2" size="md">
        Ammatit ja palkat
      </Heading>

      <Stack as="ul" gap={3} listStyleType="none" m={0} p={0} width="full">
        {paginated.map((item) => (
          <Box as="li" key={item.koodi}>
            <Stack gap={1}>
              <Flex align="baseline" gap={4} justify="space-between">
                <Box minW={0}>
                  <Text fontSize="sm" fontWeight="medium" textWrap="pretty">
                    {item.nimi}
                  </Text>
                  <Text color="fg.muted" fontSize="xs">
                    {item.paaryhma}
                  </Text>
                </Box>
                <Text flexShrink={0} fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="bold">
                  {numberFormat.format(item.mediaaniPalkka)} €/kk
                </Text>
              </Flex>
              <Box bg="bg.muted" borderRadius="sm" h="2" overflow="hidden" width="100%">
                <Box
                  aria-label={`${item.nimi}: ${numberFormat.format(item.mediaaniPalkka)} €/kk`}
                  aria-valuemax={maxSalary}
                  aria-valuemin={0}
                  aria-valuenow={item.mediaaniPalkka}
                  bg="viz.school"
                  h="100%"
                  role="meter"
                  width={`${(item.mediaaniPalkka / maxSalary) * 100}%`}
                />
              </Box>
            </Stack>
          </Box>
        ))}
      </Stack>

      {items.length > PAGE_SIZE ? (
        <Pagination count={items.length} onPageChange={onPageChange} page={page} pageSize={PAGE_SIZE} />
      ) : null}
    </Stack>
  );
}
