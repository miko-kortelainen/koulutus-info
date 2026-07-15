import { createListCollection, Field, Select } from "@chakra-ui/react";

interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface ResultSelectProps<T extends string> {
  ariaLabel?: string;
  items: readonly SelectOption<T>[];
  label: string;
  onChange: (value: T) => void;
  value: T;
}

export default function ResultSelect<T extends string>({
  ariaLabel,
  items,
  label,
  onChange,
  value,
}: ResultSelectProps<T>) {
  const collection = createListCollection({ items: [...items] });
  const selectLabel = ariaLabel ?? label;

  return (
    <Field.Root alignSelf="flex-start" flex={{ lg: 1 }} width="full">
      <Field.Label color="fg.muted" fontSize="xs">
        {label}
      </Field.Label>
      <Select.Root
        collection={collection}
        onValueChange={(event) => {
          const nextValue = event.value[0];
          if (nextValue) onChange(nextValue as T);
        }}
        size="xs"
        value={[value]}
        width="full"
      >
        <Select.HiddenSelect aria-label={selectLabel} />
        <Select.Control>
          <Select.Trigger aria-label={selectLabel}>
            <Select.ValueText />
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
    </Field.Root>
  );
}
