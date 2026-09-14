import type { LukioKeskiarvoEntry } from "@/api/dataValidation";

export const LUKIO_KUNTA_ALL = "all";

const kuntaCollator = new Intl.Collator("fi");

export function uniqueLukioKunnat(entries: LukioKeskiarvoEntry[]): string[] {
  return [...new Set(entries.map((entry) => entry.kunta))].sort((a, b) => kuntaCollator.compare(a, b));
}
