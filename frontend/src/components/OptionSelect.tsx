import { createListCollection, Select, Stack, Text } from "@chakra-ui/react";
import { useMemo } from "react";

interface OptionSelectProps<T extends string> {
  ariaLabel?: string;
  items: readonly { label: string; value: T }[];
  label?: string;
  onChange: (value: T) => void;
  placeholder?: string;
  pt?: number;
  size?: "xs" | "sm";
  value: T;
}

export default function OptionSelect<T extends string>({
  ariaLabel,
  items,
  label,
  onChange,
  placeholder,
  pt,
  size = "sm",
  value,
}: OptionSelectProps<T>) {
  const collection = useMemo(() => createListCollection({ items: [...items] }), [items]);
  const selectLabel = ariaLabel ?? label ?? placeholder ?? "";

  const select = (
    <Select.Root
      collection={collection}
      onValueChange={(e) => {
        if (e.value[0] !== undefined) onChange(e.value[0] as T);
      }}
      pt={pt}
      size={size}
      value={[value]}
      width="full"
    >
      <Select.HiddenSelect aria-label={selectLabel} />
      <Select.Control>
        <Select.Trigger aria-label={selectLabel}>
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

  if (!label) return select;

  return (
    <Stack gap={1} width="full">
      <Text color="fg.muted" fontSize="xs">
        {label}
      </Text>
      {select}
    </Stack>
  );
}
