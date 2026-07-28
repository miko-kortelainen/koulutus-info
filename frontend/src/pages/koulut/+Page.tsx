import { Box, Stack, Tabs } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { COLORS } from "@/theme";
import type { SchoolListItem } from "./+data";
import SchoolListCard from "./components/SchoolListCard";
import SortControl from "./components/SortControl";
import sortSchools, { type SortOption } from "./lib/sortSchools";

const SECTIONS = [
  { sektori: "Yliopistokoulutus", heading: "Yliopistot" },
  { sektori: "Ammattikorkeakoulukoulutus", heading: "Ammattikorkeakoulut" },
] as const;

export default function SchoolIndexPage() {
  const schools = useData<SchoolListItem[]>();
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const sortedSchools = useMemo(() => sortSchools(schools, sortOrder), [schools, sortOrder]);

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
    <>
      <PageIntro description="Korkeakoulut ja niiden hakijamäärät." title="Koulut" />
      <PageContainer align="flex-start">
        <Tabs.Root defaultValue={SECTIONS[0].heading} size="sm">
          {tabList}
          <SortControl onChange={setSortOrder} value={sortOrder} />
          {tabContent}
        </Tabs.Root>
      </PageContainer>
    </>
  );
}
