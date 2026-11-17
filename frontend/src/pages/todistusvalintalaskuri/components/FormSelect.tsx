import { createListCollection, Select } from "@chakra-ui/react";
import { useMemo } from "react";

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface FormSelectProps<T extends string> {
  ariaLabel: string;
  items: readonly SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder: string;
  value: T | "";
}

export default function FormSelect<T extends string>({
  ariaLabel,
  items,
  onChange,
  placeholder,
  value,
}: FormSelectProps<T>) {
  const collection = useMemo(() => createListCollection({ items: [...items] }), [items]);

  return (
    <Select.Root
      collection={collection}
      onValueChange={(details) => {
        const nextValue = details.value[0];
        if (nextValue) onChange(nextValue as T);
      }}
      size="md"
      value={value ? [value] : []}
      width="full"
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
          {items.map((item) => (
            <Select.Item item={item} key={item.value}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
