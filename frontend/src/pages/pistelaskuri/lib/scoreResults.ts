import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import { isScoreType, type ScoreType } from "../scoreTypes";

export interface ScoreResult {
  id: string;
  programmeName: string;
  schoolName: string;
  koulutusala: string;
  score: number;
  sector: string;
  selectionMethod: string;
}

type ScoreResultSelection = Pick<ScoreResult, "sector" | "selectionMethod">;

const isUniversityCertificateSelection = (selectionMethod: string) =>
  selectionMethod.toLocaleLowerCase("fi").includes("todistusvalinta");

export function matchesScoreType(result: ScoreResultSelection, scoreType: ScoreType) {
  if (result.sector === "Yliopistokoulutus") {
    return scoreType === "Todistusvalinta (YO)" && isUniversityCertificateSelection(result.selectionMethod);
  }

  return result.sector === "Ammattikorkeakoulukoulutus" && result.selectionMethod === scoreType;
}

export function flattenScoreResults(schools: CutoffSchool[]): ScoreResult[] {
  return schools.flatMap((school) =>
    school.programmes.flatMap((programme) =>
      programme.cutoffs.flatMap((cutoff, cutoffIndex) => {
        const isUniversitySelection =
          school.sector === "Yliopistokoulutus" && isUniversityCertificateSelection(cutoff.selectionMethod);
        const isAmkSelection = school.sector === "Ammattikorkeakoulukoulutus" && isScoreType(cutoff.selectionMethod);
        if (!isUniversitySelection && !isAmkSelection) return [];

        return [
          {
            id: [school.name, programme.name, cutoff.selectionMethod, cutoff.score, cutoffIndex].join("\0"),
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
