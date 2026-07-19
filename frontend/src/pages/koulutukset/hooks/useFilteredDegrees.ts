import Fuse from "fuse.js";
import { useMemo } from "react";
import type { ToteutusEntry } from "@/types.gen";

type ToteutusWithSektori = ToteutusEntry & { sektori: string; tutkintotaso: string };

const FUSE_OPTIONS = {
  keys: [
    { name: "toteutusNimi.fi", weight: 2 },
    { name: "toteutusNimi.en", weight: 2 },
    "oppilaitosNimi.fi",
    "oppilaitosNimi.en",
    "toteutusOid",
  ],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

export default function useFilteredDegrees(
  data: ToteutusWithSektori[] | undefined,
  searchTerm: string,
  selectedSektorit: Set<string>,
  selectedKunnat: Set<string>,
  selectedSchools: Set<string>,
  selectedTasot: Set<string>,
) {
  const byFilters = useMemo(() => {
    const items = data ?? [];
    return items.filter(
      (t) =>
        (!selectedSektorit.size || selectedSektorit.has(t.sektori)) &&
        (!selectedKunnat.size || t.kunnat.some((k) => selectedKunnat.has(k))) &&
        (!selectedSchools.size || selectedSchools.has(t.oppilaitosNimi.fi ?? "")) &&
        (!selectedTasot.size || selectedTasot.has(t.tutkintotaso)),
    );
  }, [data, selectedSektorit, selectedKunnat, selectedSchools, selectedTasot]);

  const fuse = useMemo(() => new Fuse(byFilters, FUSE_OPTIONS), [byFilters]);

  return useMemo(() => {
    const normalizedSearch = searchTerm.trim();
    return normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : byFilters;
  }, [fuse, byFilters, searchTerm]);
}
