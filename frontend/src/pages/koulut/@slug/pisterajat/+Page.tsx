import { Heading, Link, Separator, Stack, Text, VStack } from "@chakra-ui/react";
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
import SortControl, { type SortOption } from "./components/SortControl";
import useFilteredProgrammes from "./hooks/useFilteredProgrammes";

const pageSize = 5;

export default function CutoffPage() {
  const { schoolName, programmes } = useData<CutoffPageData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredProgrammes = useFilteredProgrammes(programmes, debouncedSearchTerm, sortOrder);
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
    <Stack gap={{ base: 4, md: 8 }}>
      {filteredProgrammes.length === 0 ? <Text>Ei tuloksia hakusanoilla.</Text> : null}
      {visibleProgrammes.map((programme) => (
        <CutoffCard key={programme.name} programme={programme} />
      ))}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      <VStack flex={1} width="full" zIndex={10}>
        <SearchInput
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          placeholder="Hae toteutusta"
          value={searchTerm}
        />
        <SortControl
          onChange={(value) => {
            setSortOrder(value);
            setPage(1);
          }}
          value={sortOrder}
        />
      </VStack>
      {programList}
      <Pagination count={filteredProgrammes.length} onPageChange={setPage} page={page} pageSize={pageSize} />
    </PageContainer>
  );
}
