import OptionSelect from "@/components/OptionSelect";
import type { SortOption } from "../hooks/useFilteredProgrammes";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Ö", value: "asc" },
  { label: "Ö-A", value: "desc" },
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
