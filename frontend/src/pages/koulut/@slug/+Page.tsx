import { Heading, Link, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useData } from "vike-react/useData";
import DegreeStatCard from "@/components/DegreeStatsCard";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import { slugifySchoolName } from "@/components/slug";
import PageContainer from "@/layout/PageContainer";
import { CURRENT_YEAR } from "@/pages/hakijamaarat/components/yearOptions";
import { COLORS } from "@/theme";
import type { SchoolPageData } from "./+data";

export default function SchoolPage() {
  const { schoolName, hasCutoffs, toteutukset, statistics } = useData<SchoolPageData>();
  const pageSize = 5;
  const [programPage, setProgramPage] = useState(1);
  const [statsPage, setStatsPage] = useState(1);

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="md">
        {schoolName}
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        {toteutukset.length > 0
          ? "Yhteishaussa olevat toteutukset ja edellisten hakijamäärät."
          : `${CURRENT_YEAR} menneiden yhteishakujen hakijamäärät.`}
      </Text>
      {hasCutoffs ? (
        <Link
          alignSelf="flex-start"
          fontSize="sm"
          href={`/koulut/${slugifySchoolName(schoolName)}/pisterajat/`}
          textDecoration="underline"
          textDecorationColor={COLORS.accent}
          textDecorationStyle="dotted"
        >
          Katso pisterajat
        </Link>
      ) : null}
      <Separator mt={2} />
    </Stack>
  );

  const paginatedProgramList = toteutukset.slice((programPage - 1) * pageSize, programPage * pageSize);
  const programList = (
    <Stack gap={4}>
      {paginatedProgramList.map((t, index) => (
        <SchoolCard key={`${t.toteutusOid} ${index}`} toteutus={t} />
      ))}
      <Pagination count={toteutukset.length} onPageChange={setProgramPage} page={programPage} pageSize={pageSize} />
    </Stack>
  );

  const paginatedStatsList = statistics.slice((statsPage - 1) * pageSize, statsPage * pageSize);
  const statsList = (
    <Stack gap={4}>
      {paginatedStatsList.map((d, index) => (
        <DegreeStatCard degree={d} key={`${d.kooditHakukohde} ${index}`} />
      ))}
      <Pagination count={statistics.length} onPageChange={setStatsPage} page={statsPage} pageSize={pageSize} />
    </Stack>
  );

  const tabs = [
    { value: "koulutukset", label: "Yhteishaku", content: programList, visible: toteutukset.length > 0 },
    {
      value: "hakijamaarat",
      label: `Hakijamäärät ${CURRENT_YEAR}`,
      content: statsList,
      visible: statistics.length > 0,
    },
  ].filter((t) => t.visible);

  return (
    <PageContainer>
      {header}
      {tabs.length > 0 ? (
        <Tabs.Root defaultValue={tabs[0].value} size="sm">
          <Tabs.List>
            {tabs.map(({ value, label }) => (
              <Tabs.Trigger
                flex={1}
                fontWeight="semibold"
                justifyContent="center"
                key={value}
                letterSpacing="wide"
                value={value}
              >
                {label}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator bg={COLORS.surfaceMuted} />
          </Tabs.List>
          {tabs.map(({ value, content }) => (
            <Tabs.Content key={value} value={value}>
              {content}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      ) : null}
    </PageContainer>
  );
}
