import { Accordion, Box, Flex, Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { numberFormat } from "@/lib/statistics";
import { type MergedFieldRow, salaryRange, totalEmployed } from "@/pages/tyollistyminen/lib/tyollistyminen";

interface FieldListProps {
  rows: MergedFieldRow[];
}

const EMPLOYMENT_LEVELS = [
  { key: "amk", label: "Alempi AMK" },
  { key: "yamk", label: "YAMK" },
  { key: "alempi", label: "Kandi" },
  { key: "ylempi", label: "Maisteri" },
] as const;

const SALARY_LEVELS = [
  { key: "toinenAste", label: "Toinen aste" },
  { key: "alempiKorkeakoulu", label: "Alempi korkeakoulu" },
  { key: "ylempiKorkeakoulu", label: "Ylempi korkeakoulu" },
] as const;

export default function FieldList({ rows }: FieldListProps) {
  return (
    <Accordion.Root
      as="ul"
      collapsible
      display="flex"
      flexDirection="column"
      gap={3}
      listStyleType="none"
      multiple
      width="full"
    >
      {rows.map(({ ala, employment, salary, occupations }) => {
        const range = salaryRange(salary);
        const maxOccupationSalary = Math.max(1, ...occupations.map((item) => item.mediaaniPalkka));

        return (
          <Accordion.Item as="li" key={ala} value={ala}>
            <Heading as="h2" size="sm">
              <Accordion.ItemTrigger gap={3} py={4}>
                <Text as="span" flex="1" textAlign="start">
                  {ala}
                </Text>
                {range ? (
                  <Text
                    as="span"
                    color="fg.muted"
                    display={{ base: "none", sm: "inline" }}
                    flexShrink={0}
                    fontSize="xs"
                    fontVariantNumeric="tabular-nums"
                  >
                    {numberFormat.format(range.min)}–{numberFormat.format(range.max)} €/kk
                  </Text>
                ) : null}
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
            </Heading>
            <Accordion.ItemContent>
              <Accordion.ItemBody pb={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
                  <Stack gap={5}>
                    <Stack gap={3}>
                      <Heading as="h3" color="fg.muted" size="xs">
                        Työllistyminen 3 v valmistumisesta
                      </Heading>
                      <Stack gap={3}>
                        {EMPLOYMENT_LEVELS.map(({ key, label }) => {
                          const employed = totalEmployed(employment[key]);
                          return (
                            <Stack gap={1} key={key}>
                              <Flex align="baseline" gap={3} justify="space-between">
                                <Text fontSize="sm">{label}</Text>
                                <Text fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="semibold">
                                  {employed === null ? "–" : `${employed} %`}
                                </Text>
                              </Flex>
                              {employed !== null ? (
                                <Box bg="bg.muted" borderRadius="sm" h="2" overflow="hidden" width="100%">
                                  <Box
                                    aria-label={`${ala}, ${label}: työllisiä ${employed} %`}
                                    aria-valuemax={100}
                                    aria-valuemin={0}
                                    aria-valuenow={employed}
                                    bg="accent"
                                    h="100%"
                                    role="meter"
                                    width={`${employed}%`}
                                  />
                                </Box>
                              ) : null}
                            </Stack>
                          );
                        })}
                      </Stack>
                    </Stack>

                    <Stack gap={2}>
                      <Heading as="h3" color="fg.muted" size="xs">
                        Mediaanipalkka koulutusasteittain
                      </Heading>
                      <Stack gap={1.5}>
                        {SALARY_LEVELS.map(({ key, label }) => {
                          const value = salary?.[key] ?? null;
                          return (
                            <Flex
                              align="baseline"
                              borderBottomWidth="1px"
                              borderColor="border.subtle"
                              gap={3}
                              justify="space-between"
                              key={key}
                              py={1}
                            >
                              <Text fontSize="sm">{label}</Text>
                              <Text fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="semibold">
                                {value === null ? "–" : `${numberFormat.format(value)} €/kk`}
                              </Text>
                            </Flex>
                          );
                        })}
                      </Stack>
                    </Stack>
                  </Stack>

                  <Stack gap={3}>
                    <Heading as="h3" color="fg.muted" size="xs">
                      Alan ammatit ja mediaanipalkat
                    </Heading>
                    <Stack as="ul" gap={3} listStyleType="none" m={0} p={0}>
                      {occupations.map((occupation) => (
                        <Box as="li" key={occupation.koodi}>
                          <Stack gap={1}>
                            <Flex align="baseline" gap={3} justify="space-between">
                              <Text fontSize="sm" textWrap="pretty">
                                {occupation.nimi}
                              </Text>
                              <Text
                                flexShrink={0}
                                fontSize="sm"
                                fontVariantNumeric="tabular-nums"
                                fontWeight="semibold"
                              >
                                {numberFormat.format(occupation.mediaaniPalkka)} €/kk
                              </Text>
                            </Flex>
                            <Box bg="bg.muted" borderRadius="sm" h="1.5" overflow="hidden" width="100%">
                              <Box
                                aria-label={`${occupation.nimi}: ${numberFormat.format(occupation.mediaaniPalkka)} €/kk`}
                                aria-valuemax={maxOccupationSalary}
                                aria-valuemin={0}
                                aria-valuenow={occupation.mediaaniPalkka}
                                bg="viz.school"
                                h="100%"
                                role="meter"
                                width={`${(occupation.mediaaniPalkka / maxOccupationSalary) * 100}%`}
                              />
                            </Box>
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Stack>
                </SimpleGrid>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        );
      })}
    </Accordion.Root>
  );
}
