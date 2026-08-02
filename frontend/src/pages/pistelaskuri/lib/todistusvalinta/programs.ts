import type { CutoffRound } from "@/config/cutoffRounds";
import { AMK_METHODS, CERTIFICATE_METHODS } from "./constants";
import { type GradeInput, normalizeGrades } from "./grades";
import { buildScoreBreakdown, scoreAmkAmm, scoreAmkYo, scoreModel } from "./scoring";
import { thresholdPassed } from "./thresholds";
import type {
  AmkAmmGrades,
  AmkMethod,
  AmkProgramsResponse,
  CalculatorCutoff,
  CrosswalkEntry,
  CrosswalkSourceIssue,
  CutoffProgramme,
  CutoffSchool,
  ScoreBreakdown,
  ScorableUniversityProgram,
  TodistusvalintaCatalogs,
  UniversityProgram,
} from "./types";

function programKey(university: string, program: string): string {
  return `${university}\0${program}`;
}

function crosswalkIndex(entries: CrosswalkEntry[]): Map<string, CrosswalkEntry> {
  return new Map(entries.map((entry) => [programKey(entry.university, entry.program), entry]));
}

function sourceIssueIndex(issues: CrosswalkSourceIssue[] | undefined): Map<string, CrosswalkSourceIssue> {
  const index = new Map<string, CrosswalkSourceIssue>();
  for (const issue of issues ?? []) {
    if (typeof issue.university === "string" && typeof issue.program === "string") {
      index.set(programKey(issue.university, issue.program), issue);
    }
  }
  return index;
}

function certificateCutoffs(cutoffs: CalculatorCutoff[]): CalculatorCutoff[] {
  return cutoffs.filter((cutoff) => CERTIFICATE_METHODS.has(cutoff.selectionMethod));
}

function toUniversityProgram({
  university,
  program,
  field,
  cutoffs,
  eligible,
  score,
  scoreBreakdown,
  kynnysehtoLabel,
  kynnysehtoPassed,
}: ScorableUniversityProgram): UniversityProgram {
  return {
    university,
    program,
    field,
    cutoffs,
    eligible,
    score,
    scoreBreakdown,
    kynnysehtoLabel,
    kynnysehtoPassed,
  };
}

function scorableProgram(
  school: CutoffSchool,
  source: CutoffProgramme,
  cutoffs: CalculatorCutoff[],
  fields: Pick<ScorableUniversityProgram, "eligible"> &
    Partial<Pick<ScorableUniversityProgram, "scoringModelId" | "thresholdRuleId">>,
): ScorableUniversityProgram {
  return {
    university: school.name,
    program: source.name,
    field: source.koulutusala,
    cutoffs,
    ...fields,
  };
}

export function listUniversityPrograms(
  round: CutoffRound,
  catalogs: TodistusvalintaCatalogs,
  yliopistoCutoffs: CutoffSchool[],
): ScorableUniversityProgram[] {
  const entries = crosswalkIndex(catalogs.crosswalk.entries);
  const sourceIssues = sourceIssueIndex(catalogs.crosswalk.sourceIssues);
  // ponytail: sourceIssues only apply to the reviewed 2026-kevat snapshot
  const applyIssues = round === "2026-kevat";
  const programs: ScorableUniversityProgram[] = [];

  for (const school of yliopistoCutoffs) {
    for (const source of school.programmes) {
      let cutoffs = certificateCutoffs(source.cutoffs);
      const key = programKey(school.name, source.name);
      const entry = entries.get(key);

      if (applyIssues && sourceIssues.get(key)?.affectsCutoffs) cutoffs = [];

      if (entry === undefined) {
        programs.push(scorableProgram(school, source, cutoffs, { eligible: cutoffs.length > 0 }));
        continue;
      }

      const mapping = entry.todistusvalinta;
      // ponytail: 2 route programs; UI has no route picker yet — mark ineligible
      if (mapping?.routes !== undefined) {
        programs.push(scorableProgram(school, source, cutoffs, { eligible: false }));
        continue;
      }

      programs.push(
        scorableProgram(school, source, cutoffs, {
          eligible: mapping !== null,
          scoringModelId: mapping?.scoringModelId,
          thresholdRuleId: mapping?.thresholdRuleId,
        }),
      );
    }
  }

  return programs;
}

export function calculateUniversityPrograms(
  grades: GradeInput,
  round: CutoffRound,
  catalogs: TodistusvalintaCatalogs,
  yliopistoCutoffs: CutoffSchool[],
): { applicationRound: CutoffRound; programs: UniversityProgram[] } {
  const normalized = normalizeGrades(grades, catalogs.scoring.exams);
  const scoreCache = new Map<string, { score: number; scoreBreakdown: ScoreBreakdown }>();
  const thresholdCache = new Map<string, { label: string; passed: boolean } | null>();
  const programs = listUniversityPrograms(round, catalogs, yliopistoCutoffs);

  for (const program of programs) {
    if (!program.eligible || program.scoringModelId === undefined) continue;

    let cached = scoreCache.get(program.scoringModelId);
    if (cached === undefined) {
      const scored = scoreModel(program.scoringModelId, normalized, catalogs.scoring);
      cached = {
        score: scored.score,
        scoreBreakdown: buildScoreBreakdown(normalized, scored.assignments, catalogs.scoring),
      };
      scoreCache.set(program.scoringModelId, cached);
    }
    program.score = cached.score;
    program.scoreBreakdown = cached.scoreBreakdown;

    const ruleId = program.thresholdRuleId;
    if (ruleId === null || ruleId === undefined) continue;
    let threshold = thresholdCache.get(ruleId);
    if (threshold === undefined) {
      threshold = thresholdPassed(ruleId, normalized, catalogs.thresholds.rules, catalogs.scoring.exams);
      thresholdCache.set(ruleId, threshold);
    }
    if (threshold !== null) {
      program.kynnysehtoLabel = threshold.label;
      program.kynnysehtoPassed = threshold.passed;
    }
  }

  return { applicationRound: round, programs: programs.map(toUniversityProgram) };
}

export function listPublicUniversityPrograms(
  round: CutoffRound,
  catalogs: TodistusvalintaCatalogs,
  yliopistoCutoffs: CutoffSchool[],
): UniversityProgram[] {
  return listUniversityPrograms(round, catalogs, yliopistoCutoffs).map(toUniversityProgram);
}

export function listAmkPrograms(
  method: AmkMethod,
  round: CutoffRound,
  amkCutoffs: CutoffSchool[],
): AmkProgramsResponse {
  const config = AMK_METHODS[method];
  const ammattikorkeakoulut = amkCutoffs.flatMap((sourceSchool) => {
    const programmes = sourceSchool.programmes.flatMap((sourceProgram) => {
      const cutoffs = sourceProgram.cutoffs.filter((cutoff) => config.labels.has(cutoff.selectionMethod));
      return cutoffs.length === 0
        ? []
        : [{ name: sourceProgram.name, koulutusala: sourceProgram.koulutusala, cutoffs }];
    });
    return programmes.length === 0
      ? []
      : [{ name: sourceSchool.name, sector: sourceSchool.sector, programmes }];
  });

  return {
    applicationRound: round,
    maximumScore: config.maximumScore,
    ammattikorkeakoulut,
  };
}

export function calculateAmkPrograms(
  method: AmkMethod,
  grades: GradeInput | AmkAmmGrades,
  round: CutoffRound,
  catalogs: TodistusvalintaCatalogs,
  amkCutoffs: CutoffSchool[],
): AmkProgramsResponse {
  const listed = listAmkPrograms(method, round, amkCutoffs);
  if (method === "yo") {
    const scored = scoreAmkYo(grades as GradeInput, catalogs.scoring);
    const normalized = normalizeGrades(grades as GradeInput, catalogs.scoring.exams);
    return {
      ...listed,
      score: scored.score,
      maximumScore: scored.maximumScore,
      scoreBreakdown: buildScoreBreakdown(normalized, scored.assignments, catalogs.scoring),
    };
  }
  const { score, maximumScore } = scoreAmkAmm(grades as Record<string, unknown>);
  return { ...listed, score, maximumScore };
}
