import Fuse from "fuse.js";
import { useMemo } from "react";
import type { StatisticsResponse } from "@/types.gen";
import { type SortOption, sortStatistics } from "../lib/sortStatistics";

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
  selectedSektorit: Set<string>,
  selectedKoulutusasteet: Set<string>,
  selectedKoulutusalat: Set<string>,
  selectedKielet: Set<string>,
  selectedKunnat: Set<string>,
  selectedSchools: Set<string>,
) {
  const items = useMemo(() => data ?? [], [data]);

  const byFilters = useMemo(() => {
    return items.filter(
      (d) =>
        (!selectedSektorit.size || selectedSektorit.has(d.sektori ?? "")) &&
        (!selectedKoulutusasteet.size || selectedKoulutusasteet.has(d.koulutusasteTaso1 ?? "")) &&
        (!selectedKoulutusalat.size || selectedKoulutusalat.has(d.okmOhjauksenAla ?? "")) &&
        (!selectedKielet.size || selectedKielet.has(d.koulutuksenKieli ?? "")) &&
        (!selectedKunnat.size || selectedKunnat.has(d.kuntaHakukohde ?? "")) &&
        (!selectedSchools.size || selectedSchools.has(d.korkeakoulu ?? "")),
    );
  }, [
    items,
    selectedSektorit,
    selectedKoulutusasteet,
    selectedKoulutusalat,
    selectedKielet,
    selectedKunnat,
    selectedSchools,
  ]);

  const fuse = useMemo(() => new Fuse(byFilters, FUSE_OPTIONS), [byFilters]);

  return useMemo(() => {
    const normalizedSearch = searchTerm.trim();
    const filtered = normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : byFilters;

    return sortStatistics(filtered, sortOrder);
  }, [fuse, byFilters, searchTerm, sortOrder]);
}
