import { Heading, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { useData } from "vike-react/useData";
import type { SchoolListItem } from "./+data";
import { COLORS } from "@/theme";
import SchoolListCard from "./components/SchoolListCard";

// ponytail: every school has statistics rows today; add a fallback section if stats-less schools ever appear
const SECTIONS = [
  { sektori: "Yliopistokoulutus", heading: "Yliopistot" },
  { sektori: "Ammattikorkeakoulukoulutus", heading: "Ammattikorkeakoulut" },
] as const;

export default function SchoolIndexPage() {
  const schools = useData<SchoolListItem[]>();

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Koulut
      </Heading>
      <Text color="fg.muted" fontSize="sm">
        Tilastovuoden 2026 yhteishaussa olevat koulut.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const tabList = (
    <Tabs.List>
      {SECTIONS.map(({ heading }) => (
        <Tabs.Trigger
          key={heading}
          value={heading}
          flex={1}
          justifyContent="center"
          fontWeight="semibold"
          letterSpacing="wide"
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
        {schools
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
      <Tabs.Root defaultValue={SECTIONS[0].heading} size="sm">
        {tabList}
        {tabContent}
      </Tabs.Root>
    </PageContainer>
  );
}
