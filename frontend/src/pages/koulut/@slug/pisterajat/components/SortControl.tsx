import OptionSelect from "@/components/OptionSelect";

export type SortOption = "asc" | "desc";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
];

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <OptionSelect
      ariaLabel="Järjestys"
      items={SORT_OPTIONS}
      onChange={onChange}
      placeholder="Valitse järjestys"
      size="xs"
      value={value}
    />
  );
}
