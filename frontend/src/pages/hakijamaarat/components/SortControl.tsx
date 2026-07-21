import OptionSelect from "@/components/OptionSelect";

export type SortOption =
  | "asc"
  | "desc"
  | "most_popular"
  | "least_popular"
  | "most_spots"
  | "least_spots"
  | "highest_acceptance_rate"
  | "lowest_acceptance_rate";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Ö", value: "asc" },
  { label: "Ö-A", value: "desc" },
  { label: "Eniten hakijoita", value: "most_popular" },
  { label: "Vähiten hakijoita", value: "least_popular" },
  { label: "Eniten paikkoja", value: "most_spots" },
  { label: "Vähiten paikkoja", value: "least_spots" },
  { label: "Korkein sisäänpääsyprosentti", value: "highest_acceptance_rate" },
  { label: "Matalin sisäänpääsyprosentti", value: "lowest_acceptance_rate" },
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
      size="sm"
      value={value}
    />
  );
}
