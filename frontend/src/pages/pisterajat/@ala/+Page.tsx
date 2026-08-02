import { Accordion, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import PageContainer from "@/layout/PageContainer";
import type { AlaPageData } from "./+data";
import SchoolProgrammeList from "./components/SchoolProgrammeList";

export default function AlaCutoffPage() {
  const { alaName, schools } = useData<AlaPageData>();

  const header = (
    <Stack gap={1}>
      <BackLink href="/pisterajat/" />
      <Heading as="h1" size="md">
        {alaName} – pisterajat {DEFAULT_CUTOFF_YEAR}
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Koulutusalan pisterajat kouluittain eri hakukierroksilta.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const schoolAccordions = (
    <Accordion.Root as="ul" collapsible listStyleType="none" multiple width="full">
      {schools.length === 0 ? <Text as="li">Ei pisterajoja tälle koulutusalalle.</Text> : null}
      {schools.map((school) => (
        <Accordion.Item as="li" key={school.slug} value={school.slug}>
          <Heading as="h2" size="sm">
            <Accordion.ItemTrigger py={4}>
              <Text as="span" flex="1" textAlign="start">
                {school.name}
              </Text>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent>
            <Accordion.ItemBody pb={6}>
              <SchoolProgrammeList headingLevel="h3" programmes={school.programmes} />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      {schoolAccordions}
    </PageContainer>
  );
}
