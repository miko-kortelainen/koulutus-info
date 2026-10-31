import { Heading, Link, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { guides } from "@/pages/oppaat/guides";

export default function GuidesPage() {
  return (
    <>
      <PageIntro description="Tietoa korkeakoulujen valintatavoista ja pisteytyksistä." title="Oppaat" />
      <PageContainer align="flex-start">
        <Stack as="ul" gap={4} listStyleType="none" width="full">
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
    </>
  );
}
