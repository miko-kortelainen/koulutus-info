import { HStack, Text } from "@chakra-ui/react";

export type SortOption = "asc" | "desc" | "most_popular" | "least_popular" | "most_spots" | "least_spots";

const SORT_LABELS: Record<SortOption, string> = {
  asc: "A-Z",
  desc: "Z-A",
  most_popular: "Eniten hakijoita",
  least_popular: "Vähiten hakijoita",
  most_spots: "Eniten paikkoja",
  least_spots: "Vähiten paikkoja",
};

interface SortControlProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortControl({ value, onChange }: SortControlProps) {
  return (
    <HStack gap={3}>
      <Text fontWeight="medium" fontSize="sm" color="fg.muted">
        Järjestys
      </Text>
      <select value={value} onChange={(e) => onChange(e.target.value as SortOption)}>
        {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
          <option key={key} value={key}>
            {SORT_LABELS[key]}
          </option>
        ))}
      </select>
    </HStack>
  );
}
