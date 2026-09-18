import { Alert, Box, Stack, Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import YearControl from "@/components/YearControl";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { SchoolListItem } from "@/pages/koulut/+data";
import SchoolListCard from "@/pages/koulut/components/SchoolListCard";
import SortControl from "@/pages/koulut/components/SortControl";
import useSchoolListStatistics from "@/pages/koulut/hooks/useSchoolListStatistics";
import sortSchools, { type SortOption } from "@/pages/koulut/lib/sortSchools";
import { COLORS } from "@/theme";

const SECTIONS = [
  { sektori: "Yliopistokoulutus", heading: "Yliopistot" },
  { sektori: "Ammattikorkeakoulukoulutus", heading: "Ammattikorkeakoulut" },
] as const;

export default function SchoolIndexPage() {
  const schools = useData<SchoolListItem[]>();
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const { dataReady, isUpdating, selectedYear, setSelectedYear, showError, showLoading, yearSchools } =
    useSchoolListStatistics(schools);
  const sortedSchools = useMemo(() => sortSchools(yearSchools, sortOrder), [yearSchools, sortOrder]);

  const tabList = (
    <Tabs.List aria-label="Korkeakoulut sektoreittain">
      {SECTIONS.map(({ heading }) => (
        <Tabs.Trigger
          flex={1}
          fontWeight="semibold"
          justifyContent="center"
          key={heading}
          letterSpacing="wide"
          value={heading}
        >
          {heading}
        </Tabs.Trigger>
      ))}
      <Tabs.Indicator bg={COLORS.surfaceMuted} />
    </Tabs.List>
  );

  const controls = (
    <Stack gap={4} pt={3} width="100%">
      <YearControl onChange={setSelectedYear} value={selectedYear} />
      <SortControl onChange={setSortOrder} value={sortOrder} />
    </Stack>
  );

  const status = (
    <div aria-atomic="true" aria-live="polite">
      {showLoading ? (
        <Text color="fg.muted" fontSize="sm">
          Ladataan hakijamääriä…
        </Text>
      ) : null}
      {showError ? (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Jotain meni vikaan, yritä uudelleen.</Alert.Title>
        </Alert.Root>
      ) : null}
    </div>
  );

  const tabContent = SECTIONS.map(({ sektori, heading }) => (
    <Tabs.Content key={heading} value={heading}>
      <Stack
        aria-busy={isUpdating || undefined}
        as="ul"
        gap={4}
        listStyleType="none"
        opacity={isUpdating && dataReady ? 0.5 : 1}
      >
        {dataReady && !showError
          ? sortedSchools
              .filter((s) => s.sektori === sektori)
              .map((school) => (
                <Box as="li" key={school.slug}>
                  <SchoolListCard school={school} />
                </Box>
              ))
          : null}
      </Stack>
    </Tabs.Content>
  ));

  return (
    <>
      <PageIntro description="Korkeakoulut ja niiden hakijamäärät." title="Koulut" />
      <PageContainer align="flex-start">
        <Tabs.Root defaultValue={SECTIONS[0].heading} size="sm">
          {tabList}
          {controls}
          {status}
          {tabContent}
        </Tabs.Root>
      </PageContainer>
    </>
  );
}
