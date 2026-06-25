import { Select, createListCollection } from "@chakra-ui/react";
import { YEAR_OPTIONS, type YearOption } from "./yearOptions";

const collection = createListCollection({ items: YEAR_OPTIONS });

interface YearControlProps {
  value: YearOption;
  onChange: (value: YearOption) => void;
}

export default function YearControl({ value, onChange }: YearControlProps) {
  return (
    <Select.Root
      size="sm"
      collection={collection}
      value={[value]}
      onValueChange={(e) => onChange(e.value[0] as YearOption)}
      flex={1}
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
            <Select.Item key={option.value} item={option}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
