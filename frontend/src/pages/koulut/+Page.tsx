import { Heading, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import { CURRENT_YEAR } from "@/config/yearOptions";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { SchoolListItem } from "./+data";
import SchoolListCard from "./components/SchoolListCard";
import SortControl, { type SortOption } from "./components/SortControl";

const SECTIONS = [
  { sektori: "Yliopistokoulutus", heading: "Yliopistot" },
  { sektori: "Ammattikorkeakoulukoulutus", heading: "Ammattikorkeakoulut" },
] as const;

const sortSchools = (schools: SchoolListItem[], order: SortOption): SchoolListItem[] =>
  [...schools].sort((a, b) => {
    switch (order) {
      case "desc":
        return b.name.localeCompare(a.name);
      case "most_popular":
        return b.kaikkiHakijat - a.kaikkiHakijat;
      case "least_popular":
        return a.kaikkiHakijat - b.kaikkiHakijat;
      case "most_first_choice":
        return b.ensisijaisetHakijat - a.ensisijaisetHakijat;
      case "least_first_choice":
        return a.ensisijaisetHakijat - b.ensisijaisetHakijat;
      default:
        return a.name.localeCompare(b.name);
    }
  });

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
        Tilastovuoden {CURRENT_YEAR} yhteishaussa olevat koulut.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const tabList = (
    <Tabs.List>
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
      <Stack gap={4}>
        {sortedSchools
          .filter((s) => s.sektori === sektori)
          .map((school) => (
            <SchoolListCard key={school.slug} school={school} />
          ))}
      </Stack>
    </Tabs.Content>
  ));

  return (
    <PageContainer>
      {header}
      <SortControl onChange={setSortOrder} value={sortOrder} />
      <Tabs.Root defaultValue={SECTIONS[0].heading} size="sm">
        {tabList}
        {tabContent}
      </Tabs.Root>
    </PageContainer>
  );
}
