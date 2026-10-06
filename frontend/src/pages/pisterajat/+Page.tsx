import { Heading, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import PistelaskuriCta from "@/components/PistelaskuriCta";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { CutoffIndexData } from "@/pages/pisterajat/+data";

export default function CutoffIndexPage() {
  const { alat, schools } = useData<CutoffIndexData>();

  const linkList = (items: { name: string; slug: string }[], href: (slug: string) => string) => (
    <SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={4} listStyleType="none">
      {items.map(({ name, slug }) => (
        <li key={slug}>
          <Link href={href(slug)} textDecoration="underline" textDecorationStyle="dotted">
            {name}
          </Link>
        </li>
      ))}
    </SimpleGrid>
  );

  return (
    <>
      <PageIntro
        description="Korkeakoulujen yhteishaun pisterajat koulutusaloittain ja kouluittain."
        title={`Pisterajat ${DEFAULT_CUTOFF_YEAR}`}
      />
      <PageContainer align="flex-start">
        <Text fontSize="sm">
          Ylioppilaskokeiden pisterajat ovat sivulla{" "}
          <Link href="/yo-pisterajat/" textDecoration="underline">
            YO-pisterajat
          </Link>
          .
        </Text>
        <PistelaskuriCta />
        <Stack gap={2} width="full">
          <Heading as="h2" size="md">
            Koulutusalat
          </Heading>
          {linkList(alat, (slug) => `/pisterajat/${slug}/`)}
        </Stack>
        <Stack gap={2} width="full">
          <Heading as="h2" size="md">
            Koulut
          </Heading>
          {linkList(schools, (slug) => `/koulut/${slug}/pisterajat/`)}
        </Stack>
      </PageContainer>
    </>
  );
}
