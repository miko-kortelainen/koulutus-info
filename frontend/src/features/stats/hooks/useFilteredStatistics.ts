import { useMemo } from "react";
import type { StatisticsResponse } from "@/types.gen";
import type { SortOption } from "../components/SortControl";

export default function useFilteredStatistics(
  data: StatisticsResponse | undefined,
  searchTerm: string,
  sortOrder: SortOption,
) {
  return useMemo(() => {
    const items = data ?? [];
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();
    const filtered = normalizedSearch
      ? items.filter((degree) => {
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
        })
      : items;

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "desc":
          return b.hakukohde.localeCompare(a.hakukohde);
        case "most_popular":
          return b.kaikkiHakijatLkm - a.kaikkiHakijatLkm;
        case "least_popular":
          return a.kaikkiHakijatLkm - b.kaikkiHakijatLkm;
        case "most_spots":
          return b.aloituspaikatLkm - a.aloituspaikatLkm;
        case "least_spots":
          return a.aloituspaikatLkm - b.aloituspaikatLkm;
        case "asc":
          return a.hakukohde.localeCompare(b.hakukohde);
      }
    });
  }, [data, searchTerm, sortOrder]);
}
