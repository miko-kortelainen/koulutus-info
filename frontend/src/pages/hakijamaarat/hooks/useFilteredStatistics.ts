import Fuse from "fuse.js";
import { useMemo } from "react";
import type { StatisticsResponse } from "@/types.gen";
import type { SortOption } from "../components/SortControl";

const FUSE_OPTIONS = {
  keys: [{ name: "hakukohde", weight: 3 }, { name: "korkeakoulu", weight: 2 }, "sektori", "koulutusalaTaso1"],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

export default function useFilteredStatistics(
  data: StatisticsResponse | undefined,
  searchTerm: string,
  sortOrder: SortOption,
) {
  const items = useMemo(() => data ?? [], [data]);
  const fuse = useMemo(() => new Fuse(items, FUSE_OPTIONS), [items]);

  return useMemo(() => {
    const normalizedSearch = searchTerm.trim();
    const filtered = normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : items;

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
  }, [fuse, items, searchTerm, sortOrder]);
}
