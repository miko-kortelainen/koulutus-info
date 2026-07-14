import { createListCollection, Field, Select } from "@chakra-ui/react";

export type SortOption = "lowest_cutoff" | "highest_cutoff" | "name_asc" | "name_desc";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Alin pisteraja", value: "lowest_cutoff" },
  { label: "Korkein pisteraja", value: "highest_cutoff" },
  { label: "A-Z", value: "name_asc" },
  { label: "Z-A", value: "name_desc" },
];

const collection = createListCollection({ items: SORT_OPTIONS });

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <Field.Root alignSelf={{ md: "flex-start" }} width={{ base: "full", md: "64" }}>
      <Field.Label color="fg.muted" fontSize="xs">
        Järjestysperuste
      </Field.Label>
      <Select.Root
        collection={collection}
        onValueChange={(event) => onChange(event.value[0] as SortOption)}
        size="xs"
        value={[value]}
        width="full"
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
    </Field.Root>
  );
}
