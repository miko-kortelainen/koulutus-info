import { useMemo } from "react";
import type { ToteutusEntry } from "@/types.gen";

export default function useFilteredDegrees(data: ToteutusEntry[] | undefined, searchTerm: string) {
  return useMemo(() => {
    const items = data ?? [];
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return items;
    }

    return items.filter((t) => {
      const searchableText = [
        t.oppilaitosNimi.fi,
        t.oppilaitosNimi.en,
        t.toteutusNimi.fi,
        t.toteutusNimi.en,
        t.toteutusOid,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();

      return searchableText.includes(normalizedSearch);
    });
  }, [data, searchTerm]);
}
