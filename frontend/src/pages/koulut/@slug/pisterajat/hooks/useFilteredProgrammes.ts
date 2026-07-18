import Fuse from "fuse.js";
import { useMemo } from "react";
import type { Programme } from "@/types/pisterajat.gen";
import type { SortOption } from "../components/SortControl";

const FUSE_OPTIONS = {
  keys: ["name"],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

export default function useFilteredProgrammes(programmes: Programme[], searchTerm: string, sortOrder: SortOption) {
  const fuse = useMemo(() => new Fuse(programmes, FUSE_OPTIONS), [programmes]);

  return useMemo(() => {
    const normalizedSearch = searchTerm.trim();
    const filtered = normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : programmes;

    return [...filtered].sort((a, b) =>
      sortOrder === "asc" ? a.name.localeCompare(b.name, "fi") : b.name.localeCompare(a.name, "fi"),
    );
  }, [fuse, programmes, searchTerm, sortOrder]);
}
