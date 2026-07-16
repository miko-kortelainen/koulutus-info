import OptionSelect from "@/components/OptionSelect";

export type SortOption = "asc" | "desc" | "most_popular" | "least_popular" | "most_spots" | "least_spots";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "A-Z", value: "asc" },
  { label: "Z-A", value: "desc" },
  { label: "Eniten hakijoita", value: "most_popular" },
  { label: "Vähiten hakijoita", value: "least_popular" },
  { label: "Eniten paikkoja", value: "most_spots" },
  { label: "Vähiten paikkoja", value: "least_spots" },
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
