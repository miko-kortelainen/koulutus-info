import { Accordion, Card, Heading, HStack, Separator, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import type { TyollistyminenItem } from "@/api/dataValidation";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { TyollistyminenPageData } from "@/pages/tyollistyminen/+data";
import { COLORS } from "@/theme";

const GROUPS = [
  {
    label: "Ammattikorkeakoulu",
    levels: [
      { key: "amk", label: "Alempi AMK" },
      { key: "yamk", label: "YAMK" },
    ],
  },
  {
    label: "Yliopisto",
    levels: [
      { key: "alempi", label: "Kandi" },
      { key: "ylempi", label: "Maisteri" },
    ],
  },
] as const;

/** Unweighted mean of the available degree-level figures. */
function averageEmployment({ amk, yamk, alempi, ylempi }: TyollistyminenItem): number {
  const values = [amk, yamk, alempi, ylempi].filter((value): value is number => value !== null);
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export default function TyollistyminenPage() {
  const { tyollistyminen } = useData<TyollistyminenPageData>();
  const alat = [...tyollistyminen.items].sort((a, b) => a.ala.localeCompare(b.ala, "fi"));

  return (
    <>
      <PageIntro
        description="Kuinka moni valmistunut on töissä kolmen vuoden kuluttua valmistumisesta."
        title="Työllistyminen"
      />
      <PageContainer align="flex-start">
        <Stack as="section" gap={4} width="full">
          <Accordion.Root as="ul" collapsible listStyleType="none" multiple width="full">
            {alat.map((employment) => (
              <Accordion.Item as="li" key={employment.ala} value={employment.ala}>
                <Heading as="h2" size="sm">
                  <Accordion.ItemTrigger py={4}>
                    <Text as="span" flex="1" textAlign="start">
                      {employment.ala}
                    </Text>
                    <Text as="span" color="fg.accent" fontVariantNumeric="tabular-nums" fontWeight="semibold">
                      ~{averageEmployment(employment)} %
                    </Text>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                </Heading>
                <Accordion.ItemContent>
                  <Accordion.ItemBody pb={6}>
                    <Stack as="ul" gap={{ base: 4, md: 6 }} listStyleType="none">
                      {GROUPS.map((group) => (
                        <li key={group.label}>
                          <Card.Root as="article" size="md">
                            <Card.Header pb={3}>
                              <Heading as="h3" fontSize={{ base: "xs", md: "md" }} fontWeight="semibold">
                                {group.label}
                              </Heading>
                              <Separator />
                            </Card.Header>
                            <Card.Body pt={0}>
                              <Stack gap={4}>
                                {group.levels.map(({ key, label }) => (
                                  <Stack
                                    alignItems={{ base: "flex-start", md: "center" }}
                                    borderBottom={`1px solid ${COLORS.accentFg}`}
                                    direction={{ base: "column", md: "row" }}
                                    gap={{ base: 1, md: 6 }}
                                    justify="space-between"
                                    key={key}
                                    py={1}
                                  >
                                    <Text
                                      flex={7}
                                      fontSize={{ base: "xs", md: "sm" }}
                                      fontWeight="medium"
                                      letterSpacing="wide"
                                    >
                                      {label}
                                    </Text>
                                    <HStack flex={3} justify={{ base: "space-between", md: "flex-end" }} width="100%">
                                      <Text
                                        color="fg.muted"
                                        fontSize={{ base: "xs", md: "sm" }}
                                        letterSpacing="wide"
                                        mr="auto"
                                      >
                                        Työllistyi 3 v valmistumisesta
                                      </Text>
                                      <Text
                                        fontSize={{ base: "sm", md: "lg" }}
                                        fontVariantNumeric="tabular-nums"
                                        fontWeight="bold"
                                        letterSpacing="wide"
                                      >
                                        {employment[key] === null ? "–" : `${employment[key]} %`}
                                      </Text>
                                    </HStack>
                                  </Stack>
                                ))}
                              </Stack>
                            </Card.Body>
                          </Card.Root>
                        </li>
                      ))}
                    </Stack>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Stack>
        <Text color="fg.muted" fontSize="xs">
          Lähde: Tilastokeskus, {tyollistyminen.vuosi}
        </Text>
      </PageContainer>
    </>
  );
}
