import { Select, createListCollection } from "@chakra-ui/react";

export type SortOption = "asc" | "desc" | "most_popular" | "least_popular" | "most_spots" | "least_spots";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
  { label: "Eniten hakijoita", value: "most_popular" },
  { label: "Vähiten hakijoita", value: "least_popular" },
  { label: "Eniten paikkoja", value: "most_spots" },
  { label: "Vähiten paikkoja", value: "least_spots" },
];

const collection = createListCollection({ items: SORT_OPTIONS });

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <Select.Root
      size="sm"
      collection={collection}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0] as SortOption)}
      flex={1}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Valitse järjestys" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {SORT_OPTIONS.map((option) => (
            <Select.Item key={option.value} item={option}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
