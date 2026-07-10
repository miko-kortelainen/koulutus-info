import Fuse from "fuse.js";
import { useMemo } from "react";
import type { Programme } from "@/types/pisterajat.gen";

const FUSE_OPTIONS = {
  keys: ["name"],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

export default function useFilteredProgrammes(programmes: Programme[], searchTerm: string) {
  const fuse = useMemo(() => new Fuse(programmes, FUSE_OPTIONS), [programmes]);

  return useMemo(() => {
    const normalizedSearch = searchTerm.trim();
    return normalizedSearch ? fuse.search(normalizedSearch).map((result) => result.item) : programmes;
  }, [fuse, programmes, searchTerm]);
}
