import { createListCollection, Select } from "@chakra-ui/react";

interface OptionSelectProps<T extends string> {
  ariaLabel: string;
  items: { label: string; value: T }[];
  onChange: (value: T) => void;
  placeholder: string;
  pt?: number;
  size: "xs" | "sm";
  value: T;
}

export default function OptionSelect<T extends string>({
  ariaLabel,
  items,
  onChange,
  placeholder,
  pt,
  size,
  value,
}: OptionSelectProps<T>) {
  const collection = createListCollection({ items });

  return (
    <Select.Root
      collection={collection}
      flex={1}
      onValueChange={(e) => onChange(e.value[0] as T)}
      pt={pt}
      size={size}
      value={[value]}
    >
      <Select.HiddenSelect aria-label={ariaLabel} />
      <Select.Control>
        <Select.Trigger aria-label={ariaLabel}>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {items.map((option) => (
            <Select.Item item={option} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
