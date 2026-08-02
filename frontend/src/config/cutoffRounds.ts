export type CutoffRound = `${number}-${"kevat" | "syksy"}`;

export const DEFAULT_CUTOFF_ROUND: CutoffRound = "2026-kevat";

/** Rounds with both amk and yliopisto cutoff files under public/data/pisterajat/. */
export const CALCULATOR_CUTOFF_ROUNDS: readonly CutoffRound[] = [
  "2026-kevat",
  "2025-syksy",
  "2025-kevat",
  "2024-syksy",
];

export function cutoffRoundFromFilename(filename: string): CutoffRound | null {
  const match = /^pisterajat-(\d{4})-(kevat|syksy)-(?:amk|yliopisto)\.json$/.exec(filename);
  return match ? (`${match[1]}-${match[2]}` as CutoffRound) : null;
}

export function compareCutoffRounds(a: CutoffRound, b: CutoffRound) {
  // descending string order: newest year first, syksy before kevat within a year
  return b.localeCompare(a, "fi");
}

export function cutoffRoundYear(round: CutoffRound) {
  return round.slice(0, 4);
}

export const DEFAULT_CUTOFF_YEAR = cutoffRoundYear(DEFAULT_CUTOFF_ROUND);

export function cutoffRoundLabel(round: CutoffRound) {
  const [year, season] = round.split("-");
  return `${season === "kevat" ? "Kevään" : "Syksyn"} yhteishaku ${year}`;
}

export function cutoffRoundShortLabel(round: CutoffRound) {
  const [year, season] = round.split("-");
  return `${season === "kevat" ? "kevät" : "syksy"} ${year}`;
}
