import { readCutoffSchools } from "@/api/loadData";
import { isScoreType, type ScoreType } from "./scoreTypes";

export interface ScoreResult {
  programmeName: string;
  schoolName: string;
  koulutusala: string;
  score: number;
  selectionMethod: ScoreType;
}

export const data = (): ScoreResult[] =>
  readCutoffSchools().flatMap((school) =>
    school.programmes.flatMap((programme) =>
      programme.cutoffs.flatMap((cutoff) => {
        if (!isScoreType(cutoff.selectionMethod)) return [];

        return [
          {
            programmeName: programme.name,
            schoolName: school.name,
            koulutusala: programme.koulutusala,
            score: cutoff.score,
            selectionMethod: cutoff.selectionMethod,
          },
        ];
      }),
    ),
  );
