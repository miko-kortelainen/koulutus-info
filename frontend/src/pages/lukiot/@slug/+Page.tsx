import { Heading, Separator, Stack, Table, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import PageContainer from "@/layout/PageContainer";
import type { LukioSchoolPageData } from "@/pages/lukiot/@slug/+data";
import { keskiarvoFormat } from "@/pages/lukiot/lib/formatKeskiarvo";

export default function LukioSchoolPage() {
  const { schoolName, entries } = useData<LukioSchoolPageData>();

  const header = (
    <Stack gap={1}>
      <BackLink href="/lukiot/" />
      <Heading as="h1" size="md">
        {schoolName}
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Toisen asteen yhteishaun {LUKIO_KESKIARVOT_YEAR} alimmat hyväksytyt tulokset. Yleislinjan arvo vastaa
        lukuaineiden keskiarvoa; erityislinjojen pisterajoja ei voi suoraan vertailla siihen.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const table = (
    <Stack gap={3} width="full">
      <Heading as="h2" size="sm">
        Keskiarvot ja pisterajat {LUKIO_KESKIARVOT_YEAR}
      </Heading>
      <Table.ScrollArea borderWidth="1px" maxW="full" width="full">
        <Table.Root aria-label={`${schoolName} keskiarvot ${LUKIO_KESKIARVOT_YEAR}`} size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader scope="col">Linja</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Tyyppi</Table.ColumnHeader>
              <Table.ColumnHeader scope="col" textAlign="end">
                Alin hyväksytty
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {entries.map((entry) => (
              <Table.Row key={entry.linja}>
                <Table.Cell>{entry.linja}</Table.Cell>
                <Table.Cell>{entry.yleislinja ? "Yleislinja" : "Erityislinja"}</Table.Cell>
                <Table.Cell textAlign="end">{keskiarvoFormat.format(entry.alinKeskiarvo)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      {table}
    </PageContainer>
  );
}
