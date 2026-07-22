import { Heading, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useData } from "vike-react/useData";
import CutoffCard from "@/components/CutoffCard";
import Pagination from "@/components/Pagination";
import PageContainer from "@/layout/PageContainer";
import { alaSlugParam } from "@/lib/cutoffs";
import { COLORS } from "@/theme";
import type { AlaPageData } from "./+data";

// paginated by school, no client-side search — the per-school page
// already has search; add it here only if users ask for it
const pageSize = 3;

export default function AlaCutoffPage() {
  const { alaName, schools } = useData<AlaPageData>();
  const [page, setPage] = useState(1);
  const visibleSchools = schools.slice((page - 1) * pageSize, page * pageSize);

  const header = (
    <Stack gap={1}>
      <Link
        fontSize="sm"
        href="/pisterajat/"
        textDecoration="underline"
        textDecorationColor={COLORS.accentFg}
        textDecorationStyle="dotted"
      >
        ← Takaisin
      </Link>
      <Heading as="h1" size="md">
        {alaName} – pisterajat
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Koulutusalan pisterajat kouluittain eri hakukierroksilta.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const schoolSections = (
    <Stack as="ul" gap={{ base: 8, md: 12 }} listStyleType="none" width="full">
      {schools.length === 0 ? <Text as="li">Ei pisterajoja tälle koulutusalalle.</Text> : null}
      {visibleSchools.map((school) => (
        <Stack as="li" gap={{ base: 4, md: 6 }} key={school.slug}>
          <Heading as="h2" size="sm">
            <Link
              href={`/koulut/${school.slug}/pisterajat/?ala=${alaSlugParam([alaName])}`}
              textDecoration="underline"
              textDecorationColor={COLORS.accentFg}
              textDecorationStyle="dotted"
            >
              {school.name}
            </Link>
          </Heading>
          {school.programmes.map((programme) => (
            <CutoffCard headingLevel="h3" key={programme.name} programme={programme} showRound />
          ))}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      {schoolSections}
      <Pagination count={schools.length} onPageChange={setPage} page={page} pageSize={pageSize} />
    </PageContainer>
  );
}
