import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import { isScoreType, type ScoreType } from "../scoreTypes";

export interface ScoreResult {
  programmeName: string;
  schoolName: string;
  koulutusala: string;
  score: number;
  sector: string;
  selectionMethod: ScoreType;
}

export function flattenScoreResults(schools: CutoffSchool[]): ScoreResult[] {
  return schools.flatMap((school) =>
    school.programmes.flatMap((programme) =>
      programme.cutoffs.flatMap((cutoff) => {
        if (!isScoreType(cutoff.selectionMethod)) return [];

        return [
          {
            programmeName: programme.name,
            schoolName: school.name,
            koulutusala: programme.koulutusala,
            score: cutoff.score,
            sector: school.sector,
            selectionMethod: cutoff.selectionMethod,
          },
        ];
      }),
    ),
  );
}
