import { readProgramsWithAvailableCutoffs } from "@/api/serverData";
import { PROGRAMME_ROUNDS, type ProgrammeRound } from "@/config/programmeRounds";
import type { CurrentProgramsResponse } from "@/types.gen";

export type KoulutuksetPageData = Record<ProgrammeRound, CurrentProgramsResponse>;

export const data = (): KoulutuksetPageData =>
  Object.fromEntries(
    PROGRAMME_ROUNDS.map((round) => [round, readProgramsWithAvailableCutoffs(round)]),
  ) as KoulutuksetPageData;
