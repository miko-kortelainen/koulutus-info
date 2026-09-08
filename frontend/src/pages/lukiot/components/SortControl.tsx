import OptionSelect from "@/components/OptionSelect";
import type { LukioSortOption } from "@/pages/lukiot/lib/sortLukioKeskiarvot";

const SORT_OPTIONS: { label: string; value: LukioSortOption }[] = [
  { label: "A-Ö", value: "school_asc" },
  { label: "Ö-A", value: "school_desc" },
  { label: "Matalin keskiarvo (yleislinja)", value: "score_asc" },
  { label: "Korkein keskiarvo (yleislinja)", value: "score_desc" },
];

interface SortControlProps {
  value: LukioSortOption;
  onChange: (value: LukioSortOption) => void;
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <OptionSelect
      ariaLabel="Järjestys"
      items={SORT_OPTIONS}
      onChange={onChange}
      placeholder="Valitse järjestys"
      size="sm"
      value={value}
    />
  );
}
