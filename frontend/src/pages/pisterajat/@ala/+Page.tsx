import { Stack, Text } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import OptionSelect from "@/components/OptionSelect";
import PistelaskuriCta from "@/components/PistelaskuriCta";
import SearchInput from "@/components/SearchInput";
import { type CutoffRound, cutoffRoundLabel, DEFAULT_CUTOFF_ROUND, DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { AlaPageData } from "@/pages/pisterajat/@ala/+data";
import { alaMetaDescription } from "@/pages/pisterajat/@ala/alaDescriptions";
import SchoolProgrammeList from "@/pages/pisterajat/@ala/components/SchoolProgrammeList";

const FUSE_OPTIONS = {
  keys: [
    { name: "name", weight: 2 },
    { name: "schoolName", weight: 1 },
  ],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

export default function AlaCutoffPage() {
  const { alaName, rounds, programmes } = useData<AlaPageData>();
  const [selectedRound, setSelectedRound] = useState<CutoffRound>(
    rounds.includes(DEFAULT_CUTOFF_ROUND) ? DEFAULT_CUTOFF_ROUND : rounds[0],
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const normalizedSearch = debouncedSearch.trim();
  const roundItems = useMemo(() => rounds.map((round) => ({ label: cutoffRoundLabel(round), value: round })), [rounds]);
  const roundProgrammes = useMemo(
    () =>
      programmes
        .map((programme) => ({ ...programme, cutoffs: programme.cutoffs.filter((c) => c.round === selectedRound) }))
        .filter((programme) => programme.cutoffs.length > 0),
    [programmes, selectedRound],
  );
  const fuse = useMemo(() => new Fuse(roundProgrammes, FUSE_OPTIONS), [roundProgrammes]);
  const filteredProgrammes = useMemo(
    () => (normalizedSearch ? fuse.search(normalizedSearch).map(({ item }) => item) : roundProgrammes),
    [fuse, normalizedSearch, roundProgrammes],
  );

  return (
    <>
      <PageIntro
        description={alaMetaDescription(alaName, DEFAULT_CUTOFF_YEAR).split(". ")[1]}
        title={`${alaName} pisterajat ${DEFAULT_CUTOFF_YEAR}`}
      />
      <PageContainer align="flex-start">
        <BackLink href="/pisterajat/" />
        <PistelaskuriCta />
        <Stack align="flex-start" gap={4} width="full" zIndex={10}>
          <SearchInput onChange={setSearchTerm} placeholder="Hae koulutusta tai korkeakoulua" value={searchTerm} />
          {rounds.length > 1 ? (
            <OptionSelect
              ariaLabel="Yhteishaku"
              items={roundItems}
              onChange={setSelectedRound}
              placeholder="Valitse yhteishaku"
              size="sm"
              value={selectedRound}
            />
          ) : null}
        </Stack>
        {roundProgrammes.length === 0 ? (
          <Text color="fg.muted" fontSize="sm">
            Ei pisterajoja tälle koulutusalalle.
          </Text>
        ) : filteredProgrammes.length === 0 ? (
          <Text color="fg.muted" fontSize="sm">
            Ei tuloksia valituilla hakuehdoilla.
          </Text>
        ) : (
          <SchoolProgrammeList
            headingLevel="h2"
            key={`${selectedRound}\0${normalizedSearch}`}
            programmes={filteredProgrammes}
          />
        )}
        <Text color="fg.muted" fontSize="xs">
          Lähde: Opetushallinnon tilastopalvelu Vipunen
        </Text>
      </PageContainer>
    </>
  );
}
