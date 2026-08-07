import { Alert, Box, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useData } from "vike-react/useData";
import type { HakijaprofiiliKohdeTyyppi } from "@/api/dataValidation";
import OptionSelect from "@/components/OptionSelect";
import SearchInput from "@/components/SearchInput";
import {
  DEFAULT_HAKIJAPROFIILI_ROUND,
  HAKIJAPROFIILI_YEAR_OPTIONS,
  type HakijaprofiiliRound,
} from "@/config/hakijaprofiiliRounds";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { HakijaprofiiliPageData } from "./+data";
import EntityList from "./components/EntityList";
import ProfiliDetail from "./components/ProfiliDetail";
import ScopeControl from "./components/ScopeControl";
import useFilteredEntities from "./hooks/useFilteredEntities";
import useHakijaprofiiliQuery from "./hooks/useHakijaprofiiliQuery";
import type { SortOption } from "./lib/sortEntities";

const SEARCH_PLACEHOLDER: Record<HakijaprofiiliKohdeTyyppi, string> = {
  koulu: "Hae korkeakoulua",
  koulutusala: "Hae koulutusalaa",
  tutkinto: "Hae tutkintoa",
};

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A–Ö", value: "asc" },
  { label: "Ö–A", value: "desc" },
  { label: "Eniten naispainotteinen", value: "most_female" },
  { label: "Eniten miespainotteinen", value: "most_male" },
  { label: "Eniten naisia", value: "most_female_count" },
  { label: "Eniten miehiä", value: "most_male_count" },
  { label: "Vähiten naisia", value: "least_female_count" },
  { label: "Vähiten miehiä", value: "least_male_count" },
];

export default function HakijaprofiiliPage() {
  const { currentProfili } = useData<HakijaprofiiliPageData>();
  const [selectedRound, setSelectedRound] = useState<HakijaprofiiliRound>(DEFAULT_HAKIJAPROFIILI_ROUND);
  const [scope, setScope] = useState<HakijaprofiiliKohdeTyyppi>("koulu");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOption>("asc");
  const debouncedSearch = useDebounce(searchTerm, 300);

  const query = useHakijaprofiiliQuery(
    selectedRound,
    selectedRound === DEFAULT_HAKIJAPROFIILI_ROUND ? currentProfili : undefined,
  );
  const dataReady = query.isSuccess && !query.isPlaceholderData;
  const entities = useFilteredEntities(dataReady ? query.data : undefined, scope, debouncedSearch, sortOrder);
  const selected = dataReady
    ? (query.data?.find((entity) => entity.kohdeTyyppi === scope && entity.kohdeNimi === selectedName) ?? null)
    : null;

  const clearSelection = () => {
    setSelectedName(null);
    setSearchTerm("");
  };

  const status = (
    <div aria-atomic="true" aria-live="polite">
      {(query.isPending || query.isPlaceholderData) && (
        <Text color="fg.muted" fontSize="sm">
          Ladataan hakijaprofiilia…
        </Text>
      )}
      {query.isError && (
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Title>Hakijaprofiilia ei voitu ladata. Yritä hetken kuluttua uudelleen.</Alert.Title>
        </Alert.Root>
      )}
    </div>
  );

  const browse = (
    <Stack
      alignItems={{ base: "stretch", lg: "start" }}
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 8, lg: 10 }}
      width="100%"
    >
      <Stack alignSelf={{ lg: "start" }} flex="1" gap={4} maxW={{ lg: "22rem" }} width="100%">
        <Box maxW={{ sm: "20rem" }} width="100%">
          <OptionSelect
            ariaLabel="Yhteishaku"
            items={HAKIJAPROFIILI_YEAR_OPTIONS}
            onChange={(round) => {
              setSelectedRound(round);
              clearSelection();
            }}
            placeholder="Valitse yhteishaku"
            size="sm"
            value={selectedRound}
          />
        </Box>
        <ScopeControl
          onChange={(next) => {
            setScope(next);
            clearSelection();
          }}
          value={scope}
        />
        {/* Box keeps SearchInput/OptionSelect flex={1} off the column flex axis (natural height). */}
        <Box flexShrink={0} width="100%">
          <SearchInput onChange={setSearchTerm} placeholder={SEARCH_PLACEHOLDER[scope]} value={searchTerm} />
        </Box>
        <Box flexShrink={0} width="100%">
          <OptionSelect
            ariaLabel="Järjestä"
            items={SORT_OPTIONS}
            onChange={setSortOrder}
            placeholder="A–Ö"
            size="sm"
            value={sortOrder}
          />
        </Box>
        <EntityList
          busy={query.isPlaceholderData}
          entities={entities}
          onSelect={setSelectedName}
          selectedName={selectedName}
        />
      </Stack>
      <Box aria-busy={query.isPlaceholderData || undefined} flex="2" minW={0} width="100%">
        {selected ? (
          <ProfiliDetail entity={selected} />
        ) : (
          <Stack gap={1}>
            <Text fontSize="sm" fontWeight="medium">
              Ei kohdetta valittuna
            </Text>
            <Text color="fg.muted" fontSize="sm" textWrap="pretty">
              Valitse kohde listasta nähdäksesi sukupuoli- ja ikäryhmäjakauman.
            </Text>
          </Stack>
        )}
      </Box>
    </Stack>
  );

  return (
    <>
      <PageIntro
        description="Katso yhteishaun hakijoiden sukupuoli- ja ikäjakaumaa korkeakouluittain, aloittain tai tutkintonimikkeittäin."
        title="Hakijaprofiili"
      />
      <PageContainer align="flex-start">
        {status}
        {browse}
      </PageContainer>
    </>
  );
}
