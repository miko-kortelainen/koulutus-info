import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import { SCORE_TYPES, type ScoreType } from "../scoreTypes";

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

const withFirstTime = (method: string) => [method, `${method}, ensikertalaiset`] as const;

// "AMK-valintakoe" casing has drifted in the source data before (now "AMK-Valintakoe"), so
// compare that one method case-insensitively; every other method stays an exact match.
const isAmkValintakoe = (value: string) => value.toLowerCase().startsWith("amk-valintakoe");
const sameSelectionMethod = (a: string, b: string) =>
  a === b || (isAmkValintakoe(a) && isAmkValintakoe(b) && a.toLowerCase() === b.toLowerCase());

const selectionMethodsFor = (result: ScoreResultSelection, scoreType: ScoreType) => {
  if (result.sector === "Yliopistokoulutus") {
    return scoreType === "Todistusvalinta (YO)" ? withFirstTime("Todistusvalinta") : undefined;
  }

  return result.sector === "Ammattikorkeakoulukoulutus" ? withFirstTime(scoreType) : undefined;
};

export function matchesScoreType(result: ScoreResultSelection, scoreType: ScoreType) {
  const methods = selectionMethodsFor(result, scoreType);
  return methods?.some((method) => sameSelectionMethod(method, result.selectionMethod)) ?? false;
}

const lowestCutoff = (results: ScoreResult[]) =>
  results.reduce((lowest, result) => (result.score < lowest.score ? result : lowest));

export function selectApplicantResults(
  results: ScoreResult[],
  scoreType: ScoreType,
  isFirstTimeApplicant: boolean,
): ScoreResult[] {
  const programmeGroups = new Map<string, { methods: readonly [string, string]; results: ScoreResult[] }>();
  for (const result of results) {
    const methods = selectionMethodsFor(result, scoreType);
    if (!methods?.some((method) => sameSelectionMethod(method, result.selectionMethod))) continue;

    const key = [result.sector, result.schoolName, result.programmeName].join("\0");
    const group = programmeGroups.get(key) ?? { methods, results: [] };
    group.results.push(result);
    programmeGroups.set(key, group);
  }

  return [...programmeGroups.values()].flatMap(({ methods, results: programmeResults }) => {
    const pick = (method: string) =>
      programmeResults.filter((result) => sameSelectionMethod(result.selectionMethod, method));
    const preferred = pick(isFirstTimeApplicant ? methods[1] : methods[0]);
    const chosen = preferred.length > 0 ? preferred : isFirstTimeApplicant ? pick(methods[0]) : [];
    return chosen.length > 0 ? [lowestCutoff(chosen)] : [];
  });
}

export function flattenScoreResults(schools: CutoffSchool[]): ScoreResult[] {
  return schools.flatMap((school) =>
    school.programmes.flatMap((programme) =>
      programme.cutoffs.flatMap((cutoff, cutoffIndex) => {
        const selection = { sector: school.sector, selectionMethod: cutoff.selectionMethod };
        if (!SCORE_TYPES.some(({ value }) => matchesScoreType(selection, value))) return [];

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
