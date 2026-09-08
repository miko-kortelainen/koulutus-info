import Fuse from "fuse.js";
import { useMemo } from "react";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import { slugify } from "@/lib/slug";
import {
  type LukioSortOption,
  sortLukioLinjat,
  sortLukioSchoolGroups,
} from "@/pages/lukiot/lib/sortLukioKeskiarvot";

export interface LukioSchoolGroup {
  koulu: string;
  slug: string;
  entries: LukioKeskiarvoEntry[];
  /** null when oma keskiarvo is not set; otherwise yleislinja reachability */
  reachable: boolean | null;
}

const FUSE_OPTIONS = {
  keys: [
    { name: "koulu", weight: 3 },
    { name: "linja", weight: 2 },
  ],
  threshold: 0.2,
  ignoreLocation: true,
  minMatchCharLength: 2,
  useExtendedSearch: true,
};

export function filterLukioSchools(
  entries: LukioKeskiarvoEntry[],
  searchTerm: string,
  omaKeskiarvo: number | null,
  showErityislinjat: boolean,
  sortOrder: LukioSortOption,
): LukioSchoolGroup[] {
  // Off → only yleislinjat; schools with no yleislinja drop out of the list.
  const scoped = showErityislinjat ? entries : entries.filter((entry) => entry.yleislinja);
  const normalizedSearch = searchTerm.trim();
  const filtered = normalizedSearch
    ? new Fuse(scoped, FUSE_OPTIONS).search(normalizedSearch).map((result) => result.item)
    : scoped;

  const bySchool = new Map<string, LukioKeskiarvoEntry[]>();
  for (const entry of filtered) {
    const existing = bySchool.get(entry.koulu);
    if (existing) existing.push(entry);
    else bySchool.set(entry.koulu, [entry]);
  }

  const groups = [...bySchool.entries()].flatMap(([koulu, schoolEntries]) => {
    const yleis = schoolEntries.find((entry) => entry.yleislinja);
    if (omaKeskiarvo != null && !yleis) return [];
    return [
      {
        koulu,
        slug: slugify(koulu),
        entries: sortLukioLinjat(schoolEntries),
        reachable: omaKeskiarvo == null || yleis == null ? null : omaKeskiarvo >= yleis.alinKeskiarvo,
      },
    ];
  });

  return sortLukioSchoolGroups(groups, sortOrder);
}

export default function useFilteredLukioSchools(
  entries: LukioKeskiarvoEntry[],
  searchTerm: string,
  omaKeskiarvo: number | null,
  showErityislinjat: boolean,
  sortOrder: LukioSortOption,
) {
  return useMemo(
    () => filterLukioSchools(entries, searchTerm, omaKeskiarvo, showErityislinjat, sortOrder),
    [entries, searchTerm, omaKeskiarvo, showErityislinjat, sortOrder],
  );
}
