import { Accordion, Flex, Heading, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { Fragment } from "react";
import LukiotCta from "@/components/LukiotCta";
import PistelaskuriCta from "@/components/PistelaskuriCta";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

const SOURCE_URL = "https://opintopolku.fi/konfo/fi/sivu/hakuaikataulut";

interface Haku {
  title: string;
  cta?: "pistelaskuri" | "lukiot";
  rows: [label: string, value: string][];
}

const HAUT: Haku[] = [
  {
    title: "Toisen asteen yhteishaku",
    cta: "lukiot",
    rows: [
      ["Haku alkaa", "16.2.2027 klo 8.00"],
      ["Haku loppuu", "16.3.2027 klo 15.00"],
      ["Tulokset aikaisintaan", "17.6.2027"],
      ["Paikan vastaanotto viimeistään", "1.7.2027"],
      ["Varasijoilta viimeistään", "13.8.2027"],
    ],
  },
  {
    title: "Korkeakoulujen kevään 1. yhteishaku",
    cta: "pistelaskuri",
    rows: [
      ["Haku alkaa", "7.1.2027 klo 8.00"],
      ["Haku loppuu", "21.1.2027 klo 15.00"],
      ["Tulokset viimeistään", "6.7.2027"],
      ["Paikan vastaanotto viimeistään", "13.7.2027 klo 15.00"],
      ["Varasijoilta viimeistään", "3.8.2027 klo 15.00"],
    ],
  },
  {
    title: "Korkeakoulujen kevään 2. yhteishaku",
    cta: "pistelaskuri",
    rows: [
      ["Haku alkaa", "9.3.2027 klo 8.00"],
      ["Haku loppuu", "23.3.2027 klo 15.00"],
      ["Tulokset viimeistään", "6.7.2027"],
      ["Paikan vastaanotto viimeistään", "13.7.2027 klo 15.00"],
      ["Varasijoilta viimeistään", "3.8.2027 klo 15.00"],
    ],
  },
  {
    title: "Korkeakoulujen syksyn yhteishaku",
    cta: "pistelaskuri",
    rows: [
      ["Haku alkaa", "30.8.2027 klo 8.00"],
      ["Haku loppuu", "9.9.2027 klo 15.00"],
      ["Tulokset viimeistään", "18.11.2027"],
      ["Paikan vastaanotto viimeistään", "25.11.2027 klo 15.00"],
      ["Varasijoilta viimeistään", "9.12.2027 klo 15.00"],
    ],
  },
];

export default function Yhteishaku2027Page() {
  return (
    <>
      <PageIntro
        description="Korkeakoulujen ja toisen asteen yhteishaun hakuaikataulut vuonna 2027."
        title="Yhteishaku 2027"
      />
      <PageContainer align="flex-start">
        <Stack gap={6} width="full">
          <Accordion.Root collapsible display="flex" flexDirection="column" gap={3} multiple width="full">
            {HAUT.map((haku) => (
              <Accordion.Item key={haku.title} value={haku.title}>
                <Heading as="h2" size="sm">
                  <Accordion.ItemTrigger py={4}>
                    <Text as="span" flex="1" fontSize="md" textAlign="start">
                      {haku.title}
                    </Text>
                    <Accordion.ItemIndicator />
                  </Accordion.ItemTrigger>
                </Heading>
                <Accordion.ItemContent>
                  <Accordion.ItemBody pb={6}>
                    <Stack gap={6}>
                      <Stack as="dl" gap={2}>
                        {haku.rows.map(([label, value], i) => (
                          <Fragment key={label}>
                            {i > 0 && <Separator />}
                            <Flex gap={2} justify="space-between">
                              <Text as="dt" color="fg.muted" fontSize={{ base: "sm", md: "md" }}>
                                {label}
                              </Text>
                              <Text
                                as="dd"
                                fontSize={{ base: "sm", md: "md" }}
                                fontVariantNumeric="tabular-nums"
                                fontWeight="semibold"
                                textAlign="end"
                              >
                                {value}
                              </Text>
                            </Flex>
                          </Fragment>
                        ))}
                      </Stack>
                      {haku.cta === "lukiot" ? <LukiotCta /> : null}
                      {haku.cta === "pistelaskuri" ? <PistelaskuriCta /> : null}
                    </Stack>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
          <Text color="fg.muted" fontSize="xs">
            Lähde:{" "}
            <Link href={SOURCE_URL} rel="noopener noreferrer" target="_blank" textDecoration="underline">
              Opintopolku.fi
            </Link>
          </Text>
        </Stack>
      </PageContainer>
    </>
  );
}
