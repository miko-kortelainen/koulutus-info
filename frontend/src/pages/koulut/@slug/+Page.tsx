import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import SchoolCard from "@/components/SchoolCard";
import DegreeStatCard from "@/components/DegreeStatsCard";
import type { SchoolPageData } from "./+data";

export default function SchoolPage() {
  const { schoolName, toteutukset, statistics } = useData<SchoolPageData>();

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        {schoolName}
      </Heading>
      <Text color="fg.muted">Syksyn 2026 yhteishaun koulutukset ja hakijamäärät.</Text>
      <Separator mt={2} />
    </Stack>
  );

  const programList = (
    <Stack gap={4}>
      <Heading as="h2" size="md">
        Koulutukset
      </Heading>
      {toteutukset.map((t, index) => (
        <SchoolCard key={`${t.toteutusOid} ${index}`} toteutus={t} />
      ))}
    </Stack>
  );

  // ponytail: renders all rows unpaginated (~30–115 per school); paginate if pages get heavy
  const statsList = (
    <Stack gap={4}>
      <Heading as="h2" size="md">
        Hakijamäärät 2026
      </Heading>
      {statistics.map((d, index) => (
        <DegreeStatCard degree={d} key={`${d.kooditHakukohde} ${index}`} />
      ))}
    </Stack>
  );

  return (
    <PageContainer>
      {header}
      {toteutukset.length > 0 ? programList : null}
      {statistics.length > 0 ? statsList : null}
    </PageContainer>
  );
}
