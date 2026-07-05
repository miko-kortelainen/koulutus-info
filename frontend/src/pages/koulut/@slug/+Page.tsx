import { useState } from "react";
import { ButtonGroup, Heading, HStack, IconButton, Pagination, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import SchoolCard from "@/components/SchoolCard";
import DegreeStatCard from "@/components/DegreeStatsCard";
import type { SchoolPageData } from "./+data";
import { COLORS } from "@/theme";

const pagination = (count: number, page: number, pageSize: number, onPageChange: (page: number) => void) => (
  <Pagination.Root count={count} pageSize={pageSize} page={page} onPageChange={(e) => onPageChange(e.page)}>
    <HStack justify="center">
      <ButtonGroup variant="ghost">
        <Pagination.Items
          render={(page) => (
            <IconButton variant={{ base: "ghost", _selected: "outline" }} onClick={() => window.scrollTo(0, 0)}>
              {page.value}
            </IconButton>
          )}
        />
      </ButtonGroup>
    </HStack>
  </Pagination.Root>
);

export default function SchoolPage() {
  const { schoolName, toteutukset, statistics } = useData<SchoolPageData>();
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
          : "2026 menneiden yhteishakujen hakijamäärät."}
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const paginatedProgramList = toteutukset.slice((programPage - 1) * pageSize, programPage * pageSize);
  const programList = (
    <Stack gap={4}>
      {paginatedProgramList.map((t, index) => (
        <SchoolCard key={`${t.toteutusOid} ${index}`} toteutus={t} />
      ))}
      {pagination(toteutukset.length, programPage, pageSize, setProgramPage)}
    </Stack>
  );

  const paginatedStatsList = statistics.slice((statsPage - 1) * pageSize, statsPage * pageSize);
  const statsList = (
    <Stack gap={4}>
      {paginatedStatsList.map((d, index) => (
        <DegreeStatCard degree={d} key={`${d.kooditHakukohde} ${index}`} />
      ))}
      {pagination(statistics.length, statsPage, pageSize, setStatsPage)}
    </Stack>
  );

  const tabs = [
    { value: "koulutukset", label: "Yhteishaku", content: programList, visible: toteutukset.length > 0 },
    { value: "hakijamaarat", label: "Hakijamäärät 2026", content: statsList, visible: statistics.length > 0 },
  ].filter((t) => t.visible);

  return (
    <PageContainer>
      {header}
      {tabs.length > 0 ? (
        <Tabs.Root defaultValue={tabs[0].value} size="sm">
          <Tabs.List>
            {tabs.map(({ value, label }) => (
              <Tabs.Trigger
                key={value}
                value={value}
                flex={1}
                justifyContent="center"
                fontWeight="semibold"
                letterSpacing="wide"
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
