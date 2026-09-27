import { Stack, Text } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useState } from "react";
import { useData } from "vike-react/useData";
import OptionSelect from "@/components/OptionSelect";
import SearchInput from "@/components/SearchInput";
import { type YoPisterajaRoundId, yoRoundId, yoRoundLabel } from "@/config/yoPisterajat";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { YoPisterajatPageData } from "@/pages/yo-pisterajat/+data";
import YoPisterajatTable from "@/pages/yo-pisterajat/components/YoPisterajatTable";

export default function YoPisterajatPage() {
  const rounds = useData<YoPisterajatPageData>();
  const [roundId, setRoundId] = useState<YoPisterajaRoundId>(yoRoundId(rounds[0].vuosi, rounds[0].kausi));
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 200);
  const round = rounds.find((item) => yoRoundId(item.vuosi, item.kausi) === roundId) ?? rounds[0];
  const search = debouncedSearch.trim();
  const aineet = search
    ? new Fuse(round.aineet, { keys: ["nimi"], threshold: 0.2, ignoreLocation: true, minMatchCharLength: 2 })
        .search(search)
        .map(({ item }) => item)
    : round.aineet;
  const label = yoRoundLabel(roundId);

  return (
    <>
      <PageIntro
        description="Kevään ja syksyn ylioppilaskokeiden pisterajat."
        title="YO pisterajat 2026"
      />
      <PageContainer align="flex-start">
        <Stack direction={{ base: "column", md: "row" }} gap={6} width="full">
          <OptionSelect
            ariaLabel="Kirjoituskerta"
            items={rounds.map((item) => {
              const id = yoRoundId(item.vuosi, item.kausi);
              return { label: yoRoundLabel(id), value: id };
            })}
            onChange={setRoundId}
            placeholder="Valitse kirjoituskerta"
            size="sm"
            value={roundId}
          />
          <SearchInput onChange={setSearchTerm} placeholder="Hae ainetta" value={searchTerm} />
        </Stack>
        {aineet.length === 0 ? (
          <Text>Ei tuloksia haulle.</Text>
        ) : (
          <YoPisterajatTable
            aineet={aineet}
            arvosanat={round.arvosanat}
            label={`Ylioppilaskokeiden pisterajat, ${label.toLocaleLowerCase("fi-FI")}`}
          />
        )}
      </PageContainer>
    </>
  );
}
