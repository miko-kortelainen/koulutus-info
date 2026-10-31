import { Box, Heading, Stack } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { slugify } from "@/lib/slug";
import LukioSchoolCard from "@/pages/lukiot/components/LukioSchoolCard";
import { filterLukioSchools } from "@/pages/lukiot/hooks/useFilteredLukioKeskiarvot";
import type { LukioKuntaPageData } from "@/pages/lukiot/kaupungit/@kunta/+data";
import { kunnanGenetiivi } from "@/pages/lukiot/kaupungit/lib/kuntienGenetiivit";

export default function LukioKuntaPage() {
  const { kunta, entries } = useData<LukioKuntaPageData>();
  const genetiivi = kunnanGenetiivi(kunta);
  const schools = filterLukioSchools(entries, "", null, true, "school_asc", kunta);
  return (
    <>
      <PageIntro
        description={`Yhteishaun ${LUKIO_KESKIARVOT_YEAR} lukioiden keskiarvorajat ja linjakohtaiset pisterajat.`}
        title={
          genetiivi
            ? `${genetiivi} lukiot keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`
            : `${kunta}: lukiot ja keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`
        }
      />
      <PageContainer align="flex-start">
        <BackLink href="/lukiot/kaupungit/" />
        <Stack as="ul" gap={6} listStyleType="none" width="full">
          {schools.map((school) => (
            <Box as="li" key={school.slug}>
              <Heading as="h2" mb={2} size="md">
                {school.koulu}
              </Heading>
              <LukioSchoolCard
                entries={school.entries}
                koulu={school.koulu}
                schoolHref={`/lukiot/${slugify(school.koulu)}/`}
              />
            </Box>
          ))}
        </Stack>
      </PageContainer>
    </>
  );
}
