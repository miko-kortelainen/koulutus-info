import { Heading, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import { slugifySchoolName } from "@/components/slug";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { CutoffPageData } from "./+data";
import CutoffCard from "./components/CutoffCard";

const pageSize = 5;

export default function CutoffPage() {
  const { schoolName, programmes } = useData<CutoffPageData>();
  const [page, setPage] = useState(1);
  const visibleProgrammes = programmes.slice((page - 1) * pageSize, page * pageSize);

  const linkBack = (
    <Link
      fontSize="sm"
      href={`/koulut/${slugifySchoolName(schoolName)}/`}
      textDecoration="underline"
      textDecorationColor={COLORS.accent}
      textDecorationStyle="dotted"
    >
      ← Takaisin
    </Link>
  );

  const header = (
    <Stack gap={1}>
      {linkBack}
      <Heading as="h1" size="md">
        {schoolName}n pisterajat 2026
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Tilastovuoden 2026 pisterajat valintatavoittain.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const programList = (
    <Stack gap={4}>
      {visibleProgrammes.map((programme) => (
        <CutoffCard key={programme.name} programme={programme} />
      ))}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      {programList}
      <Pagination count={programmes.length} onPageChange={setPage} page={page} pageSize={pageSize} />
    </PageContainer>
  );
}
