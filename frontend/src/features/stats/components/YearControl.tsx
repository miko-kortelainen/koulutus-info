import { Select, createListCollection } from "@chakra-ui/react";

export type YearOption = "2025" | "2024" | "2023" | "2026";

const YEAR_OPTIONS: { label: string; value: YearOption }[] = [
  { label: "2026", value: "2026" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
];

const collection = createListCollection({ items: YEAR_OPTIONS });

interface YearControlProps {
  value: YearOption;
  onChange: (value: YearOption) => void;
}

export default function YearControl({ value, onChange }: YearControlProps) {
  return (
    <Select.Root
      collection={collection}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0] as YearOption)}
      flex={1}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Valitse vuosi" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {YEAR_OPTIONS.map((option) => (
            <Select.Item key={option.value} item={option}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
