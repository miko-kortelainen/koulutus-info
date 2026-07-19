import { Box, Heading, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { CURRENT_YEAR, statisticsRoundLabel } from "@/config/yearOptions";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { SchoolListItem } from "./+data";
import SchoolListCard from "./components/SchoolListCard";
import SortControl, { type SortOption } from "./components/SortControl";
import sortSchools from "./sortSchools";

const SECTIONS = [
  { sektori: "Yliopistokoulutus", heading: "Yliopistot" },
  { sektori: "Ammattikorkeakoulukoulutus", heading: "Ammattikorkeakoulut" },
] as const;

export default function SchoolIndexPage() {
  const schools = useData<SchoolListItem[]>();
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const sortedSchools = useMemo(() => sortSchools(schools, sortOrder), [schools, sortOrder]);

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Koulut
      </Heading>
      <Text color="fg.muted" fontSize="sm">
        {statisticsRoundLabel(CURRENT_YEAR)}.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

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

  const tabContent = SECTIONS.map(({ sektori, heading }) => (
    <Tabs.Content key={heading} value={heading}>
      <Stack as="ul" gap={4} listStyleType="none">
        {sortedSchools
          .filter((s) => s.sektori === sektori)
          .map((school) => (
            <Box as="li" key={school.slug}>
              <SchoolListCard school={school} />
            </Box>
          ))}
      </Stack>
    </Tabs.Content>
  ));

  return (
    <PageContainer align="flex-start">
      {header}
      <Tabs.Root defaultValue={SECTIONS[0].heading} size="sm">
        {tabList}
        <SortControl onChange={setSortOrder} value={sortOrder} />
        {tabContent}
      </Tabs.Root>
    </PageContainer>
  );
}
