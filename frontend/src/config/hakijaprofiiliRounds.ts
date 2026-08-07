import { CURRENT_STATISTICS_ROUND, HAKIJAPROFIILI_ROUNDS } from "@/generated/dataManifest";
import { statisticsRoundLabel } from "@/config/yearOptions";

export type HakijaprofiiliRound = (typeof HAKIJAPROFIILI_ROUNDS)[number];

export const HAKIJAPROFIILI_YEAR_OPTIONS = HAKIJAPROFIILI_ROUNDS.map((round) => ({
  label: statisticsRoundLabel(round),
  value: round,
}));

export const DEFAULT_HAKIJAPROFIILI_ROUND: HakijaprofiiliRound =
  (HAKIJAPROFIILI_ROUNDS as readonly string[]).includes(CURRENT_STATISTICS_ROUND)
    ? (CURRENT_STATISTICS_ROUND as HakijaprofiiliRound)
    : HAKIJAPROFIILI_ROUNDS[0];
