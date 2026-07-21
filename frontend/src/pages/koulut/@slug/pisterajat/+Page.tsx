import { Box, Heading, Link, Separator, Stack, Tag, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import CutoffCard from "@/components/CutoffCard";
import OptionSelect from "@/components/OptionSelect";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { type CutoffRound, compareCutoffRounds, cutoffRoundLabel } from "@/config/cutoffRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import { alaNamesForAlaParam, filterProgrammesByAlaParam, newestCutoffRoundForAlaParam } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";
import { COLORS } from "@/theme";
import type { CutoffPageData } from "./+data";
import SortControl from "./components/SortControl";
import useFilteredProgrammes, { type SortOption } from "./hooks/useFilteredProgrammes";

const pageSize = 5;

export default function CutoffPage() {
  const { schoolName, programmes } = useData<CutoffPageData>();
  const { urlParsed } = usePageContext();
  // params are read only after hydration: the prerendered HTML has no query string, so
  // rendering them during hydration would mismatch the static markup
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  // only the rounds this school actually has cutoffs in
  const rounds = useMemo(
    () => [...new Set(programmes.flatMap((p) => p.cutoffs.map((c) => c.round)))].sort(compareCutoffRounds),
    [programmes],
  );
  const roundItems = useMemo(() => rounds.map((round) => ({ label: cutoffRoundLabel(round), value: round })), [rounds]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const [alaDismissed, setAlaDismissed] = useState(false);
  const [selectedRound, setSelectedRound] = useState<CutoffRound>();
  const alaParam = mounted && !alaDismissed ? urlParsed.search.ala : undefined;
  const selectedAlat = useMemo(
    () => (alaParam ? alaNamesForAlaParam(programmes, alaParam) : []),
    [programmes, alaParam],
  );
  const scopedAlaParam = selectedAlat.length > 0 ? alaParam : undefined;
  const defaultRound = useMemo(
    () => newestCutoffRoundForAlaParam(programmes, scopedAlaParam) ?? rounds[0],
    [programmes, scopedAlaParam, rounds],
  );
  const activeRound = selectedRound ?? defaultRound;
  // memoized so the Fuse index in useFilteredProgrammes only rebuilds when the scope changes
  const scopedProgrammes = useMemo(() => {
    const byAla = scopedAlaParam ? filterProgrammesByAlaParam(programmes, scopedAlaParam) : programmes;
    return byAla
      .map((p) => ({ ...p, cutoffs: p.cutoffs.filter((c) => c.round === activeRound) }))
      .filter((p) => p.cutoffs.length > 0);
  }, [programmes, scopedAlaParam, activeRound]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const filteredProgrammes = useFilteredProgrammes(scopedProgrammes, debouncedSearchTerm, sortOrder);
  const visibleProgrammes = filteredProgrammes.slice((page - 1) * pageSize, page * pageSize);

  const linkBack = (
    <Link
      fontSize="sm"
      href={`/koulut/${slugify(schoolName)}/`}
      textDecoration="underline"
      textDecorationColor={COLORS.accentFg}
      textDecorationStyle="dotted"
    >
      ← Takaisin
    </Link>
  );

  const header = (
    <Stack gap={1}>
      {linkBack}
      <Heading as="h1" size="md">
        {schoolName} – pisterajat
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Pisterajat valintatavoittain eri hakukierroksilta.
      </Text>
      <Separator mt={2} />
    </Stack>
  );

  const alaFilter =
    selectedAlat.length > 0 ? (
      <Tag.Root size={{ base: "md", md: "lg" }}>
        <Tag.Label>{selectedAlat.join(", ")}</Tag.Label>
        <Tag.EndElement>
          <Tag.CloseTrigger
            aria-label="Poista alarajaus"
            onClick={() => {
              setAlaDismissed(true);
              setPage(1);
              // drop ?ala from the address bar so a reload does not re-apply the filter
              window.history.replaceState(null, "", window.location.pathname);
            }}
          />
        </Tag.EndElement>
      </Tag.Root>
    ) : null;

  const programList = (
    <Stack as="ul" gap={{ base: 4, md: 8 }} listStyleType="none">
      {filteredProgrammes.length === 0 ? <Text as="li">Ei tuloksia valituilla rajauksilla.</Text> : null}
      {visibleProgrammes.map((programme) => (
        <Box as="li" key={programme.name}>
          <CutoffCard programme={programme} showRound={rounds.length === 1} />
        </Box>
      ))}
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      <VStack align="flex-start" flex={1} width="full" zIndex={10}>
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
        {rounds.length > 1 ? (
          <OptionSelect
            ariaLabel="Hakukierros"
            items={roundItems}
            onChange={(value) => {
              setSelectedRound(value);
              setPage(1);
            }}
            placeholder="Valitse hakukierros"
            size="xs"
            value={activeRound}
          />
        ) : null}
        {alaFilter}
      </VStack>
      {programList}
      <Pagination count={filteredProgrammes.length} onPageChange={setPage} page={page} pageSize={pageSize} />
    </PageContainer>
  );
}
