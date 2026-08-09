import type { CutoffRound } from "@/config/cutoffRounds";
import { ensureCatalogs, loadCutoffSchools } from "@/pages/pistelaskuri/lib/todistusvalinta/loadCatalogs";
import {
  calculateAmkPrograms,
  calculateUniversityPrograms,
  listAmkPrograms,
  listPublicUniversityPrograms,
} from "@/pages/pistelaskuri/lib/todistusvalinta/programs";
import type {
  AmkAmmGrades,
  AmkMethod,
  AmkProgramsResponse,
  UniversityGrade,
  UniversityProgramsResponse,
} from "@/pages/pistelaskuri/lib/todistusvalinta/types";

export type {
  AmkAmmGrades,
  AmkProgramsResponse,
  ScoreBreakdown,
  UniversityGrade,
  UniversityProgramsResponse,
} from "./types";

export async function getUniversityPrograms(round: CutoffRound): Promise<UniversityProgramsResponse> {
  const [catalogs, cutoffs] = await Promise.all([ensureCatalogs(), loadCutoffSchools(round, "yliopisto")]);
  return {
    applicationRound: round,
    programs: listPublicUniversityPrograms(round, catalogs, cutoffs),
  };
}

export async function getAmkPrograms(method: AmkMethod, round: CutoffRound): Promise<AmkProgramsResponse> {
  return listAmkPrograms(method, round, await loadCutoffSchools(round, "amk"));
}

/** Shared YO/AMM recalculation for submit and round switches. */
export async function recalculateFromGrades(
  input:
    | { selectionMethod: "Todistusvalinta (YO)"; yoGrades: Record<string, UniversityGrade> }
    | { selectionMethod: "Todistusvalinta (AMM)"; ammGrades: AmkAmmGrades },
  round: CutoffRound,
): Promise<{ amk: AmkProgramsResponse; university?: UniversityProgramsResponse }> {
  if (input.selectionMethod === "Todistusvalinta (YO)") {
    const [catalogs, yliopistoCutoffs, amkCutoffs] = await Promise.all([
      ensureCatalogs(),
      loadCutoffSchools(round, "yliopisto"),
      loadCutoffSchools(round, "amk"),
    ]);
    return {
      university: calculateUniversityPrograms(input.yoGrades, round, catalogs, yliopistoCutoffs),
      amk: calculateAmkPrograms("yo", input.yoGrades, round, catalogs, amkCutoffs),
    };
  }

  const [catalogs, amkCutoffs] = await Promise.all([ensureCatalogs(), loadCutoffSchools(round, "amk")]);
  return { amk: calculateAmkPrograms("amm", input.ammGrades, round, catalogs, amkCutoffs) };
}
