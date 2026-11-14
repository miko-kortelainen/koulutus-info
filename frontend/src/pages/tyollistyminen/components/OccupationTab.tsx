import { Box, Stack, Text } from "@chakra-ui/react";
import type { AmmattiPalkkaItem } from "@/api/dataValidation";
import OptionSelect from "@/components/OptionSelect";
import SearchInput from "@/components/SearchInput";
import OccupationSearchList from "@/pages/tyollistyminen/components/OccupationSearchList";
import type { OccupationSort } from "@/pages/tyollistyminen/lib/tyollistyminen";

const SORT_OPTIONS: { label: string; value: OccupationSort }[] = [
  { label: "Korkein palkka", value: "palkka-desc" },
  { label: "Matalin palkka", value: "palkka-asc" },
  { label: "A–Ö", value: "a-o" },
  { label: "Ö–A", value: "o-a" },
];

interface OccupationTabProps {
  group: string;
  groups: string[];
  items: AmmattiPalkkaItem[];
  maxSalary: number;
  page: number;
  search: string;
  sort: OccupationSort;
  onGroupChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: OccupationSort) => void;
}

export default function OccupationTab({
  group,
  groups,
  items,
  maxSalary,
  page,
  search,
  sort,
  onGroupChange,
  onPageChange,
  onSearchChange,
  onSortChange,
}: OccupationTabProps) {
  const groupOptions = [
    { label: "Kaikki ryhmät", value: "kaikki" },
    ...groups.map((item) => ({ label: item, value: item })),
  ];

  return (
    <Stack gap={6} width="full">
      <Stack direction={{ base: "column", md: "row" }} gap={6} width="full">
        <Box flex={1}>
          <SearchInput
            label="Haku"
            onChange={onSearchChange}
            placeholder="Hae ammattia"
            value={search}
          />
        </Box>
        <Box flex={1} maxW={{ md: "16rem" }}>
          <OptionSelect<string> items={groupOptions} label="Ammattiryhmä" onChange={onGroupChange} value={group} />
        </Box>
        <Box flex={1} maxW={{ md: "14rem" }}>
          <OptionSelect<OccupationSort> items={SORT_OPTIONS} label="Järjestys" onChange={onSortChange} value={sort} />
        </Box>
      </Stack>

      {items.length === 0 ? (
        <Text color="fg.muted" fontSize="sm">
          Ei tuloksia valituilla hakuehdoilla.
        </Text>
      ) : (
        <OccupationSearchList items={items} maxSalary={maxSalary} onPageChange={onPageChange} page={page} />
      )}
    </Stack>
  );
}
