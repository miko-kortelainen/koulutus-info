import { Box, Stack, Text } from "@chakra-ui/react";
import type { AmmattiPalkkaItem } from "@/api/dataValidation";
import OptionSelect from "@/components/OptionSelect";
import SearchInput from "@/components/SearchInput";
import FieldList from "@/pages/tyollistyminen/components/FieldList";
import OccupationSearchList from "@/pages/tyollistyminen/components/OccupationSearchList";
import type { FieldSort, MergedFieldRow } from "@/pages/tyollistyminen/lib/tyollistyminen";

const SORT_OPTIONS: { label: string; value: FieldSort }[] = [
  { label: "A–Ö", value: "a-o" },
  { label: "Ö–A", value: "o-a" },
  { label: "Korkein työllisyys", value: "tyollisyys" },
  { label: "Korkein palkka", value: "palkka" },
];

interface FieldTabProps {
  fieldRows: MergedFieldRow[];
  matchedOccupations: AmmattiPalkkaItem[];
  maxOccupationSalary: number;
  occupationPage: number;
  search: string;
  sort: FieldSort;
  onOccupationPageChange: (page: number) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: FieldSort) => void;
}

export default function FieldTab({
  fieldRows,
  matchedOccupations,
  maxOccupationSalary,
  occupationPage,
  search,
  sort,
  onOccupationPageChange,
  onSearchChange,
  onSortChange,
}: FieldTabProps) {
  const hasResults = fieldRows.length > 0 || matchedOccupations.length > 0;

  return (
    <Stack gap={6} width="full">
      <Stack direction={{ base: "column", md: "row" }} gap={6} width="full">
        <Box flex={1}>
          <SearchInput
            label="Haku"
            onChange={onSearchChange}
            placeholder="Hae alaa tai ammattia"
            value={search}
          />
        </Box>
        <Box flex={1} maxW={{ md: "16rem" }}>
          <OptionSelect<FieldSort> items={SORT_OPTIONS} label="Järjestys" onChange={onSortChange} value={sort} />
        </Box>
      </Stack>

      {!hasResults ? (
        <Text color="fg.muted" fontSize="sm">
          Ei tuloksia valituilla hakuehdoilla.
        </Text>
      ) : (
        <Stack gap={6} width="full">
          {fieldRows.length > 0 ? <FieldList rows={fieldRows} /> : null}
          <OccupationSearchList
            items={matchedOccupations}
            maxSalary={maxOccupationSalary}
            onPageChange={onOccupationPageChange}
            page={occupationPage}
          />
        </Stack>
      )}
    </Stack>
  );
}
