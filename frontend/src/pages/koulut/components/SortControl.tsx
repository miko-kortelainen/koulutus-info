import { createListCollection, Select } from "@chakra-ui/react";

export type SortOption = "asc" | "desc" | "most_popular" | "least_popular" | "most_first_choice" | "least_first_choice";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
  { label: "Eniten hakijoita", value: "most_popular" },
  { label: "Vähiten hakijoita", value: "least_popular" },
  { label: "Eniten ensisijaisia hakijoita", value: "most_first_choice" },
  { label: "Vähiten ensisijaisia hakijoita", value: "least_first_choice" },
];

const collection = createListCollection({ items: SORT_OPTIONS });

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <Select.Root
      collection={collection}
      flex={1}
      onValueChange={(e) => onChange(e.value[0] as SortOption)}
      size="sm"
      value={[value]}
    >
      <Select.HiddenSelect aria-label="Järjestys" />
      <Select.Control>
        <Select.Trigger aria-label="Järjestys">
          <Select.ValueText placeholder="Valitse järjestys" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {SORT_OPTIONS.map((option) => (
            <Select.Item item={option} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
