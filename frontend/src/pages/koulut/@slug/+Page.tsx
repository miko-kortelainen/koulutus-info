import { Heading, Link, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { useData } from "vike-react/useData";
import DegreeStatsCard from "@/components/DegreeStatsCard";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import { slugify } from "@/components/slug";
import { CURRENT_YEAR, statisticsRoundShortLabel } from "@/config/yearOptions";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { SchoolPageData } from "./+data";

export default function SchoolPage() {
  const { schoolName, hasCutoffs, toteutukset, statistics } = useData<SchoolPageData>();
  const pageSize = 5;
  const [programPage, setProgramPage] = useState(1);
  const [statsPage, setStatsPage] = useState(1);

  const linkBack = (
    <Link
      fontSize="sm"
      href="/koulut/"
      textDecoration="underline"
      textDecorationColor={COLORS.accentFg}
      textDecorationStyle="dotted"
    >
      ← Takaisin
    </Link>
  );

  const header = (
    <Stack gap={1}>
      {linkBack}
      <Heading as="h1" size="md">
        {schoolName}
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        {toteutukset.length > 0
          ? "Yhteishaussa olevat toteutukset ja edellisten hakijamäärät."
          : `Yhteishaun ${statisticsRoundShortLabel(CURRENT_YEAR)} hakijamäärät.`}
      </Text>
      {hasCutoffs ? (
        <Link
          alignSelf="flex-start"
          display="flex"
          fontSize="sm"
          fontWeight="semibold"
          gap={1}
          href={`/koulut/${slugify(schoolName)}/pisterajat/`}
          textDecoration="underline"
          textDecorationColor={COLORS.accentFg}
          textDecorationStyle="dotted"
        >
          <HiOutlineSparkles color={COLORS.accentFg} />
          Pisterajat
        </Link>
      ) : null}
      <Separator mt={2} />
    </Stack>
  );

  const paginatedProgramList = toteutukset.slice((programPage - 1) * pageSize, programPage * pageSize);
  const programList = (
    <Stack gap={4}>
      <Stack as="ul" gap={4} listStyleType="none">
        {paginatedProgramList.map((t) => (
          <SchoolCard key={t.toteutusOid} toteutus={t} />
        ))}
      </Stack>
      <Pagination count={toteutukset.length} onPageChange={setProgramPage} page={programPage} pageSize={pageSize} />
    </Stack>
  );

  const paginatedStatsList = statistics.slice((statsPage - 1) * pageSize, statsPage * pageSize);
  const statsList = (
    <Stack gap={4}>
      <Stack as="ul" gap={4} listStyleType="none">
        {paginatedStatsList.map((d) => (
          <DegreeStatsCard degree={d} key={d.kooditHakukohde} />
        ))}
      </Stack>
      <Pagination count={statistics.length} onPageChange={setStatsPage} page={statsPage} pageSize={pageSize} />
    </Stack>
  );

  const tabs = [
    {
      value: "koulutukset",
      label: "Yhteishaku",
      content: programList,
      visible: toteutukset.length > 0,
    },
    {
      value: "hakijamaarat",
      label: `Hakijamäärät, ${statisticsRoundShortLabel(CURRENT_YEAR)}`,
      content: statsList,
      visible: statistics.length > 0,
    },
  ].filter((t) => t.visible);

  return (
    <PageContainer align="flex-start">
      {header}
      {tabs.length > 0 ? (
        <Tabs.Root defaultValue={tabs[0].value} size="sm">
          <Tabs.List aria-label={`${schoolName}: tiedot`}>
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
