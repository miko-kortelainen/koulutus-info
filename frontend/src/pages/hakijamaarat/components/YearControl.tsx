import { createListCollection, Select } from "@chakra-ui/react";
import { YEAR_OPTIONS, type YearOption } from "./yearOptions";

const collection = createListCollection({ items: YEAR_OPTIONS });

interface YearControlProps {
  value: YearOption;
  onChange: (value: YearOption) => void;
}

export default function YearControl({ value, onChange }: YearControlProps) {
  return (
    <Select.Root
      collection={collection}
      flex={1}
      onValueChange={(e) => onChange(e.value[0] as YearOption)}
      size="sm"
      value={[value]}
    >
      <Select.HiddenSelect aria-label="Vuosi" />
      <Select.Control>
        <Select.Trigger aria-label="Vuosi">
          <Select.ValueText placeholder="Valitse vuosi" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {YEAR_OPTIONS.map((option) => (
            <Select.Item item={option} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
