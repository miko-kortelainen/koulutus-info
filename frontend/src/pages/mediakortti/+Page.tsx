import { Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

const STATS = [
  ["~12 000", "uniikkia kävijää (marraskuu 2026)"],
  ["~25 000", "sivulatausta (marraskuu 2026)"],
  ["~72 %", "kävijöistä hakukoneista (marraskuu 2026)"],
] as const;

export default function MediakorttiPage() {
  return (
    <>
      <PageIntro
        description="Mainostajille ja sponsoreille: Yhteishaku.app-sivuston kävijämäärät, yleisö ja mainosyhteistyö."
        title="Mediakortti"
      />
      <PageContainer align="flex-start">
        <Stack gap={8} width="full">
          <Stack as="section" gap={4} width="full">
            <Heading as="h2" size="md">
              Kävijämäärät
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              {STATS.map(([value, label]) => (
                <Stack borderColor="border" borderRadius="md" borderWidth="1px" gap={1} key={label} p={4}>
                  <Text color="fg.accent" fontSize="2xl" fontVariantNumeric="tabular-nums" fontWeight="bold">
                    {value}
                  </Text>
                  <Text color="fg.muted" fontSize="sm">
                    {label}
                  </Text>
                </Stack>
              ))}
            </SimpleGrid>
          </Stack>

          <Stack as="section" gap={2} width="full">
            <Heading as="h2" size="md">
              Tietoa sivustosta
            </Heading>
            <Text textWrap="pretty">
              Yhteishaku.app on kesäkuussa 2026 julkaistu, nopeasti kasvava sivusto, joka tavoittaa toiselle asteelle ja
              korkeakouluihin hakevia nuoria.
              <br />
              Palvelusta haetaan pisterajoja, hakijamääriä ja koulutustietoja etenkin yhteishakujen aikaan.
            </Text>
          </Stack>

          <Stack as="section" gap={2} width="full">
            <Heading as="h2" size="md">
              Ota yhteyttä
            </Heading>
            <Text textWrap="pretty">
              Jos haluat mainostaa sivustolla tai mielessäsi on muu yhteistyö, voit ottaa meihin yhteyttä sähköpostitse:{" "}
              <Link color="fg.accent" href="mailto:yhteistyo@yhteishaku.app" textDecoration="underline">
                yhteistyo@yhteishaku.app
              </Link>
              .
            </Text>
          </Stack>
        </Stack>
      </PageContainer>
    </>
  );
}
