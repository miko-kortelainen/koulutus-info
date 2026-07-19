import {
  Accordion,
  Checkmark,
  createListCollection,
  Listbox,
  type ListCollection,
  Span,
  useListboxItemContext,
  VisuallyHidden,
} from "@chakra-ui/react";

export function toCollection(values: (string | undefined)[] | undefined, label = (v: string) => v) {
  const unique = [...new Set(values?.filter((v): v is string => Boolean(v)))].sort((a, b) => a.localeCompare(b, "fi"));
  return createListCollection({ items: unique.map((v) => ({ label: label(v), value: v })) });
}

export function selectFilter(setter: (values: Set<string>) => void, resetPage: () => void) {
  return (values: string[]) => {
    setter(new Set(values));
    resetPage();
  };
}

const ItemCheckmark = () => {
  const { selected, disabled } = useListboxItemContext();
  return <Checkmark checked={selected} disabled={disabled} filled size="sm" />;
};

interface FilterItemProps {
  value: string;
  label: string;
  collection: ListCollection<{ label: string; value: string }>;
  selected: Set<string>;
  onChange: (values: string[]) => void;
  children?: React.ReactNode;
}

export function FilterItem({ value, label, collection, selected, onChange, children }: FilterItemProps) {
  return (
    <Accordion.Item value={value}>
      <Accordion.ItemTrigger>
        <Span flex="1">
          {label}
          {selected.size > 0 ? ` (${selected.size})` : ""}
        </Span>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Accordion.ItemBody>
          <Listbox.Root
            collection={collection}
            onValueChange={(details) => onChange(details.value)}
            selectionMode="multiple"
            value={[...selected]}
          >
            <VisuallyHidden asChild>
              <Listbox.Label>{label}</Listbox.Label>
            </VisuallyHidden>
            <Listbox.Content gap={2} maxH={{ base: "56", md: "96" }}>
              {collection.items.map((item) => (
                <Listbox.Item item={item} key={item.value}>
                  <ItemCheckmark />
                  <Listbox.ItemText mb="2px">{item.label}</Listbox.ItemText>
                </Listbox.Item>
              ))}
            </Listbox.Content>
          </Listbox.Root>
          {children}
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}
