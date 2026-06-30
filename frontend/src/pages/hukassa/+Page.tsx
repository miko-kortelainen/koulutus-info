import { useState } from "react";
import { Button, Em, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import useSemanticSearch from "./hooks/useSemanticSearch";
import SearchInput from "../hakijamaarat/components/SearchInput";
import { COLORS } from "@/theme";
import PageContainer from "@/layout/PageContainer";
import SuggestionCard from "./components/SuggestionCard";
import SuggestionCardSkeleton from "./components/SuggestionCardSkeleton";

export default function HukassaPage() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const { data, isFetching, error } = useSemanticSearch(query);

  const suggestionCardSkeletonList = Array.from({ length: 10 }).map((_, i) => <SuggestionCardSkeleton key={i} />);

  return (
    <PageContainer>
      <Stack gap={1}>
        <Heading as="h1" size="lg">
          Hukassa?
        </Heading>
        <Text color="fg.muted">
          Etko tiedä mitä haluaisit opiskella? Syötä alas vapain sanoin mitkä asiat sinua kiinnostaa ja näe sinulle
          sopivia koulutusvaihtoehtoja.
        </Text>
      </Stack>
      <HStack>
        <SearchInput
          value={input}
          onChange={(value) => {
            setInput(value);
          }}
          placeholder="Minua kiinnostaa..."
        />

        <Button bg={COLORS.mintLeaf} color="white" type="submit" onClick={() => setQuery(input)} size="sm">
          Hae
        </Button>
      </HStack>

      {isFetching && suggestionCardSkeletonList}
      {error && <Text color="fg.muted">jokin meni pieleen: {error.message}</Text>}
      {data && (
        <Text color="fg.muted">
          <Em>Sinulle sopivimmat koulutukset:</Em>
        </Text>
      )}
      {data?.map((r) => (
        <SuggestionCard key={r.id} result={r} />
      ))}
    </PageContainer>
  );
}
