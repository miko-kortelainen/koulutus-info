import { Heading, Link, Separator, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import PageContainer from "@/layout/PageContainer";
import type { CutoffIndexData } from "./+data";

export default function CutoffIndexPage() {
  const { alat, schools } = useData<CutoffIndexData>();

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Pisterajat
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Yhteishaun pisterajat koulutusaloittain ja kouluittain eri hakukierroksilta.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const linkList = (items: { name: string; slug: string }[], href: (slug: string) => string) => (
    <SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={2} listStyleType="none">
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
    <PageContainer align="flex-start">
      {header}
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
  );
}
