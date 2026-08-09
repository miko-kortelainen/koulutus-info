import type {
  AmkAmmGrades,
  AmkProgramsResponse,
  ScoreBreakdown,
  UniversityGrade,
  UniversityProgramsResponse,
} from "@/pages/pistelaskuri/lib/todistusvalinta/index";
import type { ScoreType } from "@/pages/pistelaskuri/scoreTypes";

export interface Calculation {
  amk: AmkProgramsResponse;
  ammGrades?: AmkAmmGrades;
  selectionMethod: ScoreType;
  university?: UniversityProgramsResponse;
  yoGrades?: Record<string, UniversityGrade>;
}

export interface ScoreResult {
  applicantScore?: number;
  id: string;
  programmeName: string;
  schoolName: string;
  koulutusala: string;
  score: number;
  sector: string;
  selectionMethod: string;
  kynnysehtoLabel?: string;
  kynnysehtoPassed?: boolean;
  scoreBreakdown?: ScoreBreakdown;
}

type ScoreResultSelection = Pick<ScoreResult, "sector" | "selectionMethod">;

const withFirstTime = (method: string) => [method, `${method}, ensikertalaiset`] as const;

const selectionMethodsFor = (result: ScoreResultSelection, scoreType: ScoreType) => {
  if (result.sector === "Yliopistokoulutus") {
    return scoreType === "Todistusvalinta (YO)" ? withFirstTime("Todistusvalinta") : undefined;
  }

  return result.sector === "Ammattikorkeakoulukoulutus" ? withFirstTime(scoreType) : undefined;
};

export function matchesScoreType(result: ScoreResultSelection, scoreType: ScoreType) {
  return selectionMethodsFor(result, scoreType)?.includes(result.selectionMethod) ?? false;
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
    if (!methods?.includes(result.selectionMethod)) continue;

    const key = [result.sector, result.schoolName, result.programmeName].join("\0");
    const group = programmeGroups.get(key) ?? { methods, results: [] };
    group.results.push(result);
    programmeGroups.set(key, group);
  }

  return [...programmeGroups.values()].flatMap(({ methods, results: programmeResults }) => {
    const pick = (method: string) => programmeResults.filter((result) => result.selectionMethod === method);
    const preferred = pick(isFirstTimeApplicant ? methods[1] : methods[0]);
    const chosen = preferred.length > 0 ? preferred : isFirstTimeApplicant ? pick(methods[0]) : [];
    return chosen.length > 0 ? [lowestCutoff(chosen)] : [];
  });
}

export function flattenAmkPrograms({
  ammattikorkeakoulut,
  score: applicantScore,
  scoreBreakdown,
}: AmkProgramsResponse): ScoreResult[] {
  return ammattikorkeakoulut.flatMap((school) =>
    school.programmes.flatMap((programme) =>
      programme.cutoffs.map((cutoff, cutoffIndex) => ({
        applicantScore,
        id: [school.name, programme.name, cutoff.selectionMethod, cutoff.score, cutoffIndex].join("\0"),
        programmeName: programme.name,
        schoolName: school.name,
        koulutusala: programme.koulutusala,
        score: cutoff.score,
        sector: school.sector,
        selectionMethod: cutoff.selectionMethod,
        scoreBreakdown,
      })),
    ),
  );
}

export function flattenUniversityPrograms({ programs }: UniversityProgramsResponse): ScoreResult[] {
  return programs.flatMap((program) => {
    if (!program.eligible) return [];

    return program.cutoffs.map((cutoff, cutoffIndex) => ({
      applicantScore: program.score,
      id: [program.university, program.program, cutoff.selectionMethod, cutoff.score, cutoffIndex].join("\0"),
      programmeName: program.program,
      schoolName: program.university,
      koulutusala: program.field || "Tieto puuttuu",
      score: cutoff.score,
      sector: "Yliopistokoulutus",
      selectionMethod: cutoff.selectionMethod,
      kynnysehtoLabel: program.kynnysehtoLabel,
      kynnysehtoPassed: program.kynnysehtoPassed,
      scoreBreakdown: program.scoreBreakdown,
    }));
  });
}
