import { Accordion, Box, Heading, Separator, Stack, Tag, Text, VStack } from "@chakra-ui/react";
import { useMemo, useState, useSyncExternalStore } from "react";
import { useData } from "vike-react/useData";
import { usePageContext } from "vike-react/usePageContext";
import BackLink from "@/components/BackLink";
import CutoffCard from "@/components/CutoffCard";
import OptionSelect from "@/components/OptionSelect";
import SearchInput from "@/components/SearchInput";
import { type CutoffRound, compareCutoffRounds, cutoffRoundLabel, cutoffRoundYear } from "@/config/cutoffRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import { alaNamesForAlaParam, filterProgrammesByAlaParam, newestCutoffRoundForAlaParam } from "@/lib/cutoffs";
import type { CutoffPageData } from "@/pages/koulut/@slug/pisterajat/+data";
import SortControl from "@/pages/koulut/@slug/pisterajat/components/SortControl";
import useFilteredProgrammes, { type SortOption } from "@/pages/koulut/@slug/pisterajat/hooks/useFilteredProgrammes";

const collator = new Intl.Collator("fi");

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
  const programmesByAla = useMemo(() => {
    const byAla = new Map<string, typeof filteredProgrammes>();
    for (const programme of filteredProgrammes) {
      const group = byAla.get(programme.koulutusala) ?? [];
      group.push(programme);
      byAla.set(programme.koulutusala, group);
    }
    return [...byAla.entries()].sort(([a], [b]) => collator.compare(a, b));
  }, [filteredProgrammes]);

  const header = (
    <Stack gap={1}>
      <BackLink href="../" />
      <Heading as="h1" size="md">
        {schoolName} pisterajat {cutoffRoundYear(activeRound)}
      </Heading>
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Yhteishaun alimmat hyväksytyt pisteet aloittain.
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
              // drop ?ala from the address bar so a reload does not re-apply the filter
              window.history.replaceState(null, "", window.location.pathname);
            }}
          />
        </Tag.EndElement>
      </Tag.Root>
    ) : null;

  const programList = (
    <Accordion.Root
      aria-label="Pisterajat koulutusaloittain"
      as="ul"
      collapsible
      display="flex"
      flexDirection="column"
      gap={3}
      listStyleType="none"
      multiple
      width="full"
    >
      {programmesByAla.length === 0 ? <Text as="li">Ei tuloksia valituilla rajauksilla.</Text> : null}
      {programmesByAla.map(([ala, alaProgrammes]) => (
        <Accordion.Item as="li" key={ala} value={ala}>
          <Heading as="h2" size="sm">
            <Accordion.ItemTrigger py={4}>
              <Text as="span" color="text" flex="1" fontSize="sm" textAlign="start" textWrap="pretty">
                {ala}
              </Text>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent>
            <Accordion.ItemBody pb={6}>
              <Stack as="ul" gap={{ base: 4, md: 6 }} listStyleType="none">
                {alaProgrammes.map((programme) => (
                  <Box as="li" key={`${programme.name}\0${programme.koulutusala}`}>
                    <CutoffCard headingLevel="h3" programme={programme} showRound={rounds.length === 1} />
                  </Box>
                ))}
              </Stack>
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );

  return (
    <PageContainer align="flex-start">
      {header}
      <VStack align="flex-start" flex={1} width="full" zIndex={10}>
        <SearchInput onChange={setSearchTerm} placeholder="Hae toteutusta" value={searchTerm} />
        <SortControl onChange={setSortOrder} value={sortOrder} />
        {rounds.length > 1 ? (
          <OptionSelect
            ariaLabel="Hakukierros"
            items={roundItems}
            onChange={setSelectedRound}
            placeholder="Valitse hakukierros"
            size="xs"
            value={activeRound}
          />
        ) : null}
        {alaFilter}
      </VStack>
      {programList}
    </PageContainer>
  );
}
