import { AMM_AVERAGE_THRESHOLDS, AMM_SECTION_POINTS } from "./constants";
import { type GradeInput, normalizeGrades } from "./grades";
import type { ScoreAssignment, ScoreBreakdown, ScoringCatalog, ScoringModel } from "./types";

export type { ScoreAssignment, ScoreBreakdown } from "./types";

function expandedSlots(model: ScoringModel): [string, string][] {
  const slots: [string, string][] = [];
  for (const slot of model.slots) {
    const count = slot.count ?? 1;
    for (let number = 1; number <= count; number += 1) {
      const suffix = count > 1 ? `-${number}` : "";
      slots.push([`${slot.id}${suffix}`, slot.pool]);
    }
  }
  return slots;
}

interface PoolCandidate {
  curveId: string | null;
  exam: string | null;
  grade: string | null;
  group: string | null;
  pointsTenths: number;
}

interface DpState {
  picks: PoolCandidate[];
  total: number;
}

/** Return the best candidate per logical subject group for one slot. */
function poolCandidates(
  pool: { byExam?: Record<string, string>; byKind?: Record<string, string> },
  grades: Record<string, string>,
  catalog: ScoringCatalog,
): PoolCandidate[] {
  const bestByGroup = new Map<string, PoolCandidate>();

  for (const [exam, grade] of Object.entries(grades)) {
    const examInfo = catalog.exams[exam];
    if (examInfo === undefined) continue;
    const curveId = pool.byExam?.[exam] ?? pool.byKind?.[examInfo.kind];
    if (curveId === undefined) continue;
    const points = catalog.pointCurves[curveId]?.[grade];
    if (points === undefined || points === 0) continue;

    const candidate: PoolCandidate = {
      exam,
      grade,
      group: examInfo.group,
      curveId,
      pointsTenths: points,
    };
    const current = bestByGroup.get(examInfo.group);
    if (
      current === undefined ||
      points > current.pointsTenths ||
      (points === current.pointsTenths && exam > (current.exam ?? ""))
    ) {
      bestByGroup.set(examInfo.group, candidate);
    }
  }

  return [...bestByGroup.values()].sort((a, b) => {
    if (b.pointsTenths !== a.pointsTenths) return b.pointsTenths - a.pointsTenths;
    return (a.exam ?? "").localeCompare(b.exam ?? "");
  });
}

function usedKey(groups: Iterable<string>): string {
  return [...groups].sort().join("\0");
}

export interface ScoreResult {
  assignments: ScoreAssignment[];
  maximumScore: number;
  score: number;
}

/** Build UI breakdown in the same order as the entered grades. */
export function buildScoreBreakdown(
  grades: GradeInput,
  assignments: ScoreAssignment[],
  catalog: ScoringCatalog,
): ScoreBreakdown {
  const pointsByExam = new Map(assignments.map((assignment) => [assignment.exam, assignment.points]));
  const rows: ScoreBreakdown["rows"] = [];
  for (const [exam, grade] of Object.entries(grades)) {
    const label = catalog.exams[exam]?.label;
    if (label === undefined) continue;
    rows.push({
      exam,
      grade: String(grade),
      label,
      points: pointsByExam.get(exam) ?? null,
    });
  }
  return { rows };
}

/** Calculate the globally best valid assignment for one scoring model. */
export function scoreModel(modelId: string, grades: GradeInput, catalog: ScoringCatalog): ScoreResult {
  const model = catalog.models[modelId];
  if (model === undefined) throw new Error(`Unknown scoring model: ${JSON.stringify(modelId)}`);
  const normalized = normalizeGrades(grades, catalog.exams);

  // State is keyed by used logical subjects (sorted groups joined).
  let states = new Map<string, DpState>([["", { total: 0, picks: [] }]]);

  for (const [, poolId] of expandedSlots(model)) {
    const pool = catalog.pools[poolId];
    if (pool === undefined) throw new Error(`Unknown pool: ${JSON.stringify(poolId)}`);
    const candidates = poolCandidates(pool, normalized, catalog);
    candidates.push({ exam: null, grade: null, group: null, curveId: null, pointsTenths: 0 });

    const nextStates = new Map<string, DpState>();
    for (const [used, state] of states) {
      const usedGroups = used === "" ? new Set<string>() : new Set(used.split("\0"));
      for (const candidate of candidates) {
        const group = candidate.group;
        if (group !== null && usedGroups.has(group)) continue;
        const nextUsed = group === null ? usedGroups : new Set([...usedGroups, group]);
        const nextTotal = state.total + candidate.pointsTenths;
        const key = usedKey(nextUsed);
        const previous = nextStates.get(key);
        if (previous === undefined || nextTotal > previous.total) {
          nextStates.set(key, { total: nextTotal, picks: [...state.picks, candidate] });
        }
      }
    }
    states = nextStates;
  }

  let best: DpState | undefined;
  for (const state of states.values()) {
    if (best === undefined || state.total > best.total) best = state;
  }

  const assignments: ScoreAssignment[] = [];
  for (const pick of best?.picks ?? []) {
    if (pick.exam === null || pick.grade === null) continue;
    assignments.push({
      exam: pick.exam,
      grade: pick.grade,
      label: catalog.exams[pick.exam]?.label ?? pick.exam,
      points: pick.pointsTenths / 10,
    });
  }

  return {
    score: (best?.total ?? -1) / 10,
    maximumScore: model.maximumTenths / 10,
    assignments,
  };
}

export function scoreAmkYo(grades: GradeInput, catalog: ScoringCatalog): ScoreResult {
  return scoreModel("amk-yo", grades, catalog);
}

function parseNumberText(name: string, value: unknown): string {
  if (typeof value === "boolean" || value === null || value === undefined) {
    throw new Error(`${name} must be a number`);
  }
  const text = String(value).trim().replace(",", ".");
  if (text === "" || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text)) {
    throw new Error(`${name} must be a number`);
  }
  if (!Number.isFinite(Number(text))) throw new Error(`${name} must be a finite number`);
  return text;
}

/**
 * Parse a decimal string into integer hundredths without `number * 100`.
 * "2.03" → 203. Extra fractional digits are truncated (floor for positives),
 * which matches Decimal comparisons against integer hundredth thresholds.
 */
export function averageToHundredths(text: string): number {
  const negative = text.startsWith("-");
  const unsigned = text.replace(/^[+-]/, "");
  const [wholePart, fracPart = ""] = unsigned.split(".");
  const whole = wholePart === "" ? 0 : Number(wholePart);
  const padded = `${fracPart}00`.slice(0, 2);
  const hundredths = whole * 100 + Number(padded);
  return negative ? -hundredths : hundredths;
}

export interface AmmAssignment {
  grade: number;
  part: string;
  points: number;
}

export interface AmmScoreResult {
  assignments: AmmAssignment[];
  maximumScore: number;
  score: number;
}

/** Score an eligible vocational qualification for AMK admission. */
export function scoreAmkAmm(grades: Record<string, unknown>): AmmScoreResult {
  if (grades === null || typeof grades !== "object" || Array.isArray(grades)) {
    throw new Error("AMM grades must be an object");
  }

  const required = ["gradeScale", "communication", "mathematicsSciences", "societyWork", "weightedAverage"] as const;
  const missing = required.filter((field) => !(field in grades));
  if (missing.length > 0) {
    throw new Error(`Missing AMM grade fields: ${missing.slice().sort().join(", ")}`);
  }

  const scaleText = parseNumberText("gradeScale", grades.gradeScale);
  const scaleNumber = Number(scaleText);
  if (scaleNumber !== 3 && scaleNumber !== 5) throw new Error("gradeScale must be 3 or 5");
  const scale = scaleNumber as 3 | 5;

  const sectionPoints: AmmAssignment[] = [];
  for (const field of ["communication", "mathematicsSciences", "societyWork"] as const) {
    const gradeText = parseNumberText(field, grades[field]);
    const gradeNumber = Number(gradeText);
    if (!Number.isInteger(gradeNumber) || !(gradeNumber in AMM_SECTION_POINTS[scale])) {
      throw new Error(`${field} must be an integer from 1 to ${scale}`);
    }
    sectionPoints.push({
      part: field,
      grade: gradeNumber,
      points: AMM_SECTION_POINTS[scale][gradeNumber] ?? 0,
    });
  }

  const averageText = parseNumberText("weightedAverage", grades.weightedAverage);
  const averageHundredths = averageToHundredths(averageText);
  if (averageHundredths < 100 || averageHundredths > scale * 100) {
    throw new Error(`weightedAverage must be from 1 to ${scale}`);
  }

  const thresholds = AMM_AVERAGE_THRESHOLDS[scale];
  const averageIndex = thresholds.findIndex((threshold) => averageHundredths >= threshold);
  if (averageIndex < 0) throw new Error(`weightedAverage must be from 1 to ${scale}`);
  const averagePoints = 90 - averageIndex;

  const assignments = [
    ...sectionPoints,
    { part: "weightedAverage", grade: Number(averageText), points: averagePoints },
  ];

  return {
    score: assignments.reduce((sum, item) => sum + item.points, 0),
    maximumScore: 150,
    assignments,
  };
}
