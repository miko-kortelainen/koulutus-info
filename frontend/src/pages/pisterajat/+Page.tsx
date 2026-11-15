import { Card, Heading, HStack, Link, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import PistelaskuriCta from "@/components/PistelaskuriCta";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { CutoffIndexData } from "@/pages/pisterajat/+data";
import { alaIcon } from "@/pages/pisterajat/alaIcons";
import { COLORS } from "@/theme";

export default function CutoffIndexPage() {
  const { alat, schools } = useData<CutoffIndexData>();

  const linkList = (items: { name: string; slug: string }[], href: (slug: string) => string, withIcons = false) => (
    <SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={3} listStyleType="none">
      {items.map(({ name, slug }) => {
        const Icon = withIcons ? alaIcon(name) : undefined;
        return (
          <li key={slug}>
            <Card.Root asChild size="sm">
              <Link _hover={{ textDecoration: "none" }} aria-label={name} href={href(slug)}>
                <Card.Body width="full">
                  <HStack gap={3}>
                    {Icon ? (
                      <span aria-hidden="true" style={{ color: COLORS.accentFg, display: "flex" }}>
                        <Icon />
                      </span>
                    ) : null}
                    <Text fontSize={{ base: "sm", md: "md" }} fontWeight="semibold">
                      {name}
                    </Text>
                  </HStack>
                </Card.Body>
              </Link>
            </Card.Root>
          </li>
        );
      })}
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
        <Stack as="section" gap={2} width="full">
          <Heading as="h2" size="md">
            Koulutusalat
          </Heading>
          {linkList(alat, (slug) => `/pisterajat/${slug}/`, true)}
        </Stack>
        {[
          { sector: "Yliopistokoulutus", label: "Yliopistot" },
          { sector: "Ammattikorkeakoulukoulutus", label: "Ammattikorkeakoulut" },
        ].map(({ sector, label }) => (
          <Stack as="section" gap={2} key={sector} width="full">
            <Heading as="h2" size="md">
              {label}
            </Heading>
            {linkList(
              schools.filter((school) => school.sector === sector),
              (slug) => `/koulut/${slug}/pisterajat/`,
            )}
          </Stack>
        ))}
      </PageContainer>
    </>
  );
}
