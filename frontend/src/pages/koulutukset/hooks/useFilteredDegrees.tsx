import Fuse from "fuse.js";
import { useMemo } from "react";
import type { ToteutusEntry } from "@/types.gen";

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
  data: ToteutusEntry[] | undefined,
  searchTerm: string,
  selectedSchools: Set<string>,
) {
  const bySchool = useMemo(() => {
    const items = data ?? [];
    return selectedSchools.size ? items.filter((t) => selectedSchools.has(t.oppilaitosNimi.fi ?? "")) : items;
  }, [data, selectedSchools]);

  const fuse = useMemo(() => new Fuse(bySchool, FUSE_OPTIONS), [bySchool]);

  return useMemo(() => {
    const normalizedSearch = searchTerm.trim();
    return normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : bySchool;
  }, [fuse, bySchool, searchTerm]);
}
