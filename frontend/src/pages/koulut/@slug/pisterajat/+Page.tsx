import { Heading, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { slugifySchoolName } from "@/components/slug";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { CutoffPageData } from "./+data";
import CutoffCard from "./components/CutoffCard";
import useFilteredProgrammes from "./hooks/useFilteredProgrammes";

const pageSize = 5;

export default function CutoffPage() {
  const { schoolName, programmes } = useData<CutoffPageData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredProgrammes = useFilteredProgrammes(programmes, debouncedSearchTerm);
  const visibleProgrammes = filteredProgrammes.slice((page - 1) * pageSize, page * pageSize);

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
        {schoolName} pisterajat 2026
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Tilastovuoden 2026 pisterajat valintatavoittain.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const programList = (
    <Stack gap={4}>
      {filteredProgrammes.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
      {visibleProgrammes.map((programme) => (
        <CutoffCard key={programme.name} programme={programme} />
      ))}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      <SearchInput
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Hae toteutusta"
        value={searchTerm}
      />
      {programList}
      <Pagination count={filteredProgrammes.length} onPageChange={setPage} page={page} pageSize={pageSize} />
    </PageContainer>
  );
}
