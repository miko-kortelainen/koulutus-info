import OptionSelect from "@/components/OptionSelect";
import type { SortOption } from "../lib/sortSchools";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Ö", value: "asc" },
  { label: "Ö-A", value: "desc" },
  { label: "Eniten hakijoita", value: "most_popular" },
  { label: "Vähiten hakijoita", value: "least_popular" },
  { label: "Eniten ensisijaisia hakijoita", value: "most_first_choice" },
  { label: "Vähiten ensisijaisia hakijoita", value: "least_first_choice" },
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
      pt={3}
      size="sm"
      value={value}
    />
  );
}
