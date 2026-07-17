import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { guides } from "./guides";

export default function GuidesPage() {
  return (
    <PageContainer align="flex-start">
      <Stack gap={1}>
        <Heading as="h1" size="lg">
          Oppaat
        </Heading>
        <Text color="fg.muted">Tietoa korkeakoulujen valintatavoista ja pisteytyksistä.</Text>
      </Stack>
      <Stack as="ul" gap={4} listStyleType="none">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link display="block" href={`/oppaat/${guide.slug}/`}>
              <Heading as="h2" size="md" textDecoration="underline">
                {guide.title}
              </Heading>
              <Text color="fg.muted" fontSize="sm" mt={1}>
                {guide.description}
              </Text>
            </Link>
          </li>
        ))}
      </Stack>
    </PageContainer>
  );
}
