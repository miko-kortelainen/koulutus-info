import { Heading, HStack, Link, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiOutlineChatAlt2, HiOutlineSparkles } from "react-icons/hi";
import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import Pagination from "@/components/Pagination";
import SchoolCard from "@/components/SchoolCard";
import PageContainer from "@/layout/PageContainer";
import { slugify } from "@/lib/slug";
import type { SchoolPageData } from "@/pages/koulut/@slug/+data";
import SchoolStatistics from "@/pages/koulut/@slug/components/SchoolStatistics";
import { COLORS } from "@/theme";

export default function SchoolPage() {
  const { schoolName, hasCutoffs, hasFeedback, toteutukset, statistics, statisticsYear } = useData<SchoolPageData>();
  const pageSize = 5;
  const [programPage, setProgramPage] = useState(1);

  const header = (
    <Stack gap={1}>
      <BackLink href="/koulut/" />
      <Heading as="h1" size="md">
        {schoolName}
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        {toteutukset.length > 0
          ? "Yhteishaun pisterajat, hakijamäärät ja toteutukset."
          : "Yhteishaun pisterajat ja hakijamäärät."}
      </Text>
      {hasCutoffs || hasFeedback ? (
        <HStack align="flex-start" flexWrap="wrap" gap={{ base: 2, md: 4 }}>
          {hasCutoffs ? (
            <Link
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
          {hasFeedback ? (
            <Link
              display="flex"
              fontSize="sm"
              fontWeight="semibold"
              gap={1}
              href={`/koulut/${slugify(schoolName)}/opiskelijapalautteet/`}
              textDecoration="underline"
              textDecorationColor={COLORS.accentFg}
              textDecorationStyle="dotted"
            >
              <HiOutlineChatAlt2 aria-hidden="true" color={COLORS.accentFg} />
              Opiskelijapalautteet
            </Link>
          ) : null}
        </HStack>
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

  const tabs = [
    {
      value: "koulutukset",
      label: "Yhteishaku",
      content: programList,
      visible: toteutukset.length > 0,
    },
    {
      value: "hakijamaarat",
      label: "Hakijamäärät",
      content: (
        <SchoolStatistics initialStatistics={statistics} schoolName={schoolName} statisticsYear={statisticsYear} />
      ),
      visible: statistics.length > 0,
    },
  ].filter((t) => t.visible);

  return (
    <PageContainer align="flex-start">
      {header}
      {tabs.length > 0 ? (
        <Tabs.Root defaultValue={tabs[0].value} size="sm">
          <Tabs.List aria-label={`${schoolName}: tiedot`} overflowX="auto">
            {tabs.map(({ value, label }) => (
              <Tabs.Trigger
                flex={{ base: "0 0 auto", md: 1 }}
                fontWeight="semibold"
                justifyContent="center"
                key={value}
                letterSpacing="wide"
                value={value}
                whiteSpace="nowrap"
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
