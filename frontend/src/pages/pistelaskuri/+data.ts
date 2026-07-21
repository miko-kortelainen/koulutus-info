import { availableCutoffRounds, readCutoffSchools } from "@/api/serverData";
import { type CutoffRound, DEFAULT_CUTOFF_ROUND } from "@/config/cutoffRounds";
import { flattenScoreResults, type ScoreResult } from "./lib/scoreResults";

export interface ScoreCalculatorPageData {
  initialResults: ScoreResult[];
  initialRound: CutoffRound;
  rounds: CutoffRound[];
}

export const data = (): ScoreCalculatorPageData => {
  const rounds = availableCutoffRounds();
  if (!rounds.includes(DEFAULT_CUTOFF_ROUND)) {
    throw new Error(`Default cutoff round ${DEFAULT_CUTOFF_ROUND} is not available`);
  }

  return {
    initialResults: flattenScoreResults(readCutoffSchools(DEFAULT_CUTOFF_ROUND)),
    initialRound: DEFAULT_CUTOFF_ROUND,
    rounds,
  };
};
