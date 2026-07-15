import { createListCollection, Select } from "@chakra-ui/react";

export type SortOption = "asc" | "desc";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
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
      size="xs"
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
