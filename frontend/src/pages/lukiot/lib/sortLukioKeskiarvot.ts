import type { LukioKeskiarvoEntry } from "@/api/dataValidation";

export type LukioSortOption = "school_asc" | "school_desc" | "score_asc" | "score_desc";

const schoolCollator = new Intl.Collator("fi");

export function sortLukioLinjat(entries: LukioKeskiarvoEntry[]): LukioKeskiarvoEntry[] {
  return [...entries].sort(
    (a, b) => Number(b.yleislinja) - Number(a.yleislinja) || a.alinKeskiarvo - b.alinKeskiarvo || a.linja.localeCompare(b.linja, "fi"),
  );
}

/** Yleislinja score only; schools without a yleislinja sort last for score orders. */
export function yleislinjaScore(entries: LukioKeskiarvoEntry[]): number | null {
  return entries.find((entry) => entry.yleislinja)?.alinKeskiarvo ?? null;
}

export function sortLukioSchoolGroups<T extends { koulu: string; entries: LukioKeskiarvoEntry[] }>(
  groups: T[],
  sortOrder: LukioSortOption,
): T[] {
  return [...groups].sort((a, b) => {
    const byName = schoolCollator.compare(a.koulu, b.koulu);
    if (sortOrder === "school_desc") return -byName || 0;
    if (sortOrder === "school_asc") return byName;

    const scoreA = yleislinjaScore(a.entries);
    const scoreB = yleislinjaScore(b.entries);
    if (scoreA == null && scoreB == null) return byName;
    if (scoreA == null) return 1;
    if (scoreB == null) return -1;

    if (sortOrder === "score_desc") return scoreB - scoreA || byName;
    return scoreA - scoreB || byName;
  });
}

/** Accepts Finnish decimal commas. Empty or invalid → null (no keskiarvo filter). */
export function parseOmaKeskiarvo(value: string): number | null {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}
