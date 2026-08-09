import { CURRENT_STATISTICS_ROUND, STATISTICS_ROUNDS } from "@/generated/dataManifest";

export type YearOption = (typeof STATISTICS_ROUNDS)[number];
export type RoundLabelId = YearOption | typeof import("@/generated/dataManifest").HAKIJAPROFIILI_ROUNDS[number];

export function statisticsRoundLabel(round: RoundLabelId) {
  const [year, season] = round.split("_");
  return `${season === "kevat" ? "Kevään" : "Syksyn"} yhteishaku ${year}`;
}

export function statisticsRoundShortLabel(round: RoundLabelId) {
  const [year, season] = round.split("_");
  return `${season === "kevat" ? "kevät" : "syksy"} ${year}`;
}

export const YEAR_OPTIONS = STATISTICS_ROUNDS.map((round) => ({
  label: statisticsRoundLabel(round),
  value: round,
}));

export const CURRENT_YEAR = CURRENT_STATISTICS_ROUND;
