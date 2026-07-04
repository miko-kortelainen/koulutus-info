import { Card, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import type { SchoolListItem } from "./+data";

// ponytail: every school has statistics rows today; add a fallback section if stats-less schools ever appear
const SECTIONS = [
  { sektori: "Yliopistokoulutus", heading: "Yliopistot" },
  { sektori: "Ammattikorkeakoulukoulutus", heading: "Ammattikorkeakoulut" },
] as const;

export default function SchoolIndexPage() {
  const schools = useData<SchoolListItem[]>();

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Koulut
      </Heading>
      <Text color="fg.muted">Syksyn 2026 yhteishaussa mukana olevat korkeakoulut.</Text>
      <Separator mt={2} />
    </Stack>
  );

  return (
    <PageContainer>
      {header}
      {SECTIONS.map(({ sektori, heading }) => {
        const items = schools.filter((s) => s.sektori === sektori);
        if (items.length === 0) return null;
        return (
          <Stack key={heading} gap={4}>
            <Heading as="h2" size="md">
              {heading}
            </Heading>
            {items.map((school) => (
              <Card.Root key={school.slug} size="sm" asChild _hover={{ borderColor: "fg.muted" }}>
                <a href={`/koulut/${school.slug}`}>
                  <Card.Body>
                    <Text fontWeight="semibold">{school.name}</Text>
                    <Text color="fg.muted" fontSize="sm">
                      {school.hakukohteet} hakukohdetta · {school.ensisijaisetHakijat} ensisijaista hakijaa
                    </Text>
                  </Card.Body>
                </a>
              </Card.Root>
            ))}
          </Stack>
        );
      })}
    </PageContainer>
  );
}
