import { useMemo } from "react";
import type { ToteutusEntry } from "@/types.gen";

export default function useFilteredDegrees(
  data: ToteutusEntry[] | undefined,
  searchTerm: string,
  selectedSchools: Set<string>,
) {
  return useMemo(() => {
    const items = data ?? [];
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

    return items
      .filter((t) => !selectedSchools.size || selectedSchools.has(t.oppilaitosNimi.fi ?? ""))
      .filter((t) => {
        if (!normalizedSearch) return true;
        return [t.oppilaitosNimi.fi, t.oppilaitosNimi.en, t.toteutusNimi.fi, t.toteutusNimi.en, t.toteutusOid]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase()
          .includes(normalizedSearch);
      });
  }, [data, searchTerm, selectedSchools]);
}
