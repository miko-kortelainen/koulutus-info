import type { CutoffRound } from "@/config/cutoffRounds";

export type UniversityGrade = "I" | "A" | "B" | "C" | "M" | "E" | "L";

export type AmkMethod = "yo" | "amm";

export interface ScoreAssignment {
  exam: string;
  grade: string;
  label: string;
  points: number;
}

export interface ScoreBreakdownRow {
  exam: string;
  grade: string;
  label: string;
  /** Points when the aine was used in the best combination; otherwise null. */
  points: number | null;
}

export interface ScoreBreakdown {
  rows: ScoreBreakdownRow[];
}

export interface CalculatorCutoff {
  score: number;
  selectionMethod: string;
  startSeason: string;
  startYear: number;
}

export interface UniversityProgram {
  cutoffs: CalculatorCutoff[];
  eligible: boolean;
  field: string;
  kynnysehtoLabel?: string;
  kynnysehtoPassed?: boolean;
  program: string;
  score?: number;
  scoreBreakdown?: ScoreBreakdown;
  university: string;
}

export interface UniversityProgramsResponse {
  applicationRound: CutoffRound;
  programs: UniversityProgram[];
}

export interface AmkSchool {
  name: string;
  programmes: {
    cutoffs: CalculatorCutoff[];
    koulutusala: string;
    name: string;
  }[];
  sector: string;
}

export interface AmkProgramsResponse {
  applicationRound: CutoffRound;
  ammattikorkeakoulut: AmkSchool[];
  maximumScore: number;
  score?: number;
  scoreBreakdown?: ScoreBreakdown;
}

export interface AmkAmmGrades {
  communication: number;
  gradeScale: 3 | 5;
  mathematicsSciences: number;
  societyWork: number;
  weightedAverage: number | string;
}

export interface ExamInfo {
  group: string;
  kind: string;
  label: string;
}

export interface ScoringSlot {
  count?: number;
  id: string;
  pool: string;
}

export interface ScoringModel {
  maximumTenths: number;
  slots: ScoringSlot[];
}

export interface ScoringPool {
  byExam?: Record<string, string>;
  byKind?: Record<string, string>;
}

export interface ScoringCatalog {
  exams: Record<string, ExamInfo>;
  models: Record<string, ScoringModel>;
  pointCurves: Record<string, Record<string, number>>;
  pools: Record<string, ScoringPool>;
}

export type ThresholdExpression =
  | { exam: string; minGrade: string }
  | { any: ThresholdExpression[] }
  | { all: ThresholdExpression[] };

export interface ThresholdRule {
  expression: ThresholdExpression;
  id: string;
  label: string;
}

export interface ThresholdCatalog {
  rules: ThresholdRule[];
}

export interface CrosswalkMapping {
  // ponytail: route picker deferred; presence alone marks ineligible
  routes?: unknown[];
  scoringModelId?: string;
  thresholdRuleId?: string | null;
}

export interface CrosswalkSourceIssue {
  affectsCutoffs?: boolean;
  program?: string;
  type?: string;
  university?: string;
}

export interface CrosswalkEntry {
  program: string;
  todistusvalinta: CrosswalkMapping | null;
  university: string;
}

export interface ProgramCrosswalk {
  entries: CrosswalkEntry[];
  sourceIssues?: CrosswalkSourceIssue[];
}

export interface CutoffProgramme {
  cutoffs: CalculatorCutoff[];
  koulutusala: string;
  name: string;
}

export interface CutoffSchool {
  name: string;
  programmes: CutoffProgramme[];
  sector: string;
}

export interface TodistusvalintaCatalogs {
  crosswalk: ProgramCrosswalk;
  scoring: ScoringCatalog;
  thresholds: ThresholdCatalog;
}

/** Internal list row: public UniversityProgram fields plus scoring keys used during calculate. */
export interface ScorableUniversityProgram extends UniversityProgram {
  scoringModelId?: string;
  thresholdRuleId?: string | null;
}
