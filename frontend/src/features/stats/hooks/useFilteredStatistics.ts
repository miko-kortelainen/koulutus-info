import { useMemo } from "react";
import type { StatisticsResponse } from "@/types.gen";

export default function useFilteredStatistics(data: StatisticsResponse | undefined, searchTerm: string) {
  return useMemo(() => {
    const items = data ?? [];
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((degree) => {
      const searchableText = [
        degree.hakukohde,
        degree.korkeakoulu,
        degree.koulutuksenKieli,
        degree.sektori,
        degree.koulutusalaTaso1,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [data, searchTerm]);
}
