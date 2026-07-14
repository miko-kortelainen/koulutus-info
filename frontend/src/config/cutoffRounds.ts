export type CutoffRound = `${number}-${"kevat" | "syksy"}`;

export const DEFAULT_CUTOFF_ROUND: CutoffRound = "2026-kevat";

export function cutoffRoundFromFilename(filename: string): CutoffRound | null {
  const match = /^pisterajat-(\d{4})-(kevat|syksy)\.json$/.exec(filename);
  return match ? (`${match[1]}-${match[2]}` as CutoffRound) : null;
}

export function compareCutoffRounds(a: CutoffRound, b: CutoffRound) {
  // descending string order: newest year first, syksy before kevat within a year
  return b.localeCompare(a);
}

export function cutoffRoundLabel(round: CutoffRound) {
  const [year, season] = round.split("-");
  return `${season === "kevat" ? "Kevään" : "Syksyn"} yhteishaku ${year}`;
}

export function cutoffRoundShortLabel(round: CutoffRound) {
  const [year, season] = round.split("-");
  return `${season === "kevat" ? "kevät" : "syksy"} ${year}`;
}
