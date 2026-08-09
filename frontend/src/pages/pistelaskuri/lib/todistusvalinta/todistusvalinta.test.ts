// Run with: pnpm exec tsx src/pages/pistelaskuri/lib/todistusvalinta/todistusvalinta.test.ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeGrades } from "@/pages/pistelaskuri/lib/todistusvalinta/grades";
import { listUniversityPrograms, calculateUniversityPrograms } from "@/pages/pistelaskuri/lib/todistusvalinta/programs";
import {
  averageToHundredths,
  buildScoreBreakdown,
  scoreAmkAmm,
  scoreAmkYo,
  scoreModel,
} from "@/pages/pistelaskuri/lib/todistusvalinta/scoring";
import type {
  CutoffSchool,
  ProgramCrosswalk,
  ScoringCatalog,
  ThresholdCatalog,
  TodistusvalintaCatalogs,
} from "@/pages/pistelaskuri/lib/todistusvalinta/types";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../../../../public");
const scoring = JSON.parse(
  readFileSync(join(root, "data/todistusvalinta/scoring-models-2026.json"), "utf8"),
) as ScoringCatalog;

const GRADES = { ai_fi: "L", ena: "E", maa: "E", te: "B", hi: "E" };

assert.equal(scoreModel("target-language-english", GRADES, scoring).score, 122.3);
assert.equal(scoreAmkYo(GRADES, scoring).score, 166);
assert.equal(scoreModel("philosophy-history-theology", { maa: "L" }, scoring).score, 28.9);

const amkBreakdown = scoreAmkYo(GRADES, scoring);
const sumAssignmentPoints = (assignments: { points: number }[]) =>
  Math.round(assignments.reduce((sum, assignment) => sum + assignment.points * 10, 0)) / 10;
assert.equal(sumAssignmentPoints(amkBreakdown.assignments), amkBreakdown.score);
assert.deepEqual(
  amkBreakdown.assignments.map((assignment) => assignment.exam).sort(),
  ["ai_fi", "ena", "hi", "maa", "te"].sort(),
);

const englishModel = scoreModel("target-language-english", GRADES, scoring);
assert.equal(sumAssignmentPoints(englishModel.assignments), englishModel.score);
assert.ok(englishModel.assignments.some((assignment) => assignment.exam === "ai_fi"));
assert.ok(englishModel.assignments.some((assignment) => assignment.exam === "ena"));

const orderedGrades = { te: "B", ai_fi: "L", maa: "E", ena: "E", hi: "E" };
const orderedBreakdown = buildScoreBreakdown(orderedGrades, amkBreakdown.assignments, scoring);
assert.deepEqual(
  orderedBreakdown.rows.map((row) => row.exam),
  ["te", "ai_fi", "maa", "ena", "hi"],
);

assert.equal(
  scoreAmkAmm({
    gradeScale: 3,
    communication: 2,
    mathematicsSciences: 3,
    societyWork: 3,
    weightedAverage: 2.81,
  }).score,
  132,
);

assert.deepEqual(normalizeGrades({ ai_smn: "L" }, scoring.exams), { ai_smn: "L" });

// Integer hundredths: float 2.03 * 100 is 202.999… and would miss threshold 203.
assert.equal(averageToHundredths("2.03"), 203);
assert.equal(
  scoreAmkAmm({
    gradeScale: 3,
    communication: 2,
    mathematicsSciences: 3,
    societyWork: 3,
    weightedAverage: "2.03",
  }).assignments.at(-1)?.points,
  43,
);

const thresholds = JSON.parse(
  readFileSync(join(root, "data/todistusvalinta/threshold-rules-2026.json"), "utf8"),
) as ThresholdCatalog;
const crosswalk = JSON.parse(
  readFileSync(join(root, "data/todistusvalinta/program-crosswalk-2026.json"), "utf8"),
) as ProgramCrosswalk;
const catalogs: TodistusvalintaCatalogs = { scoring, thresholds, crosswalk };
const yliopisto2026 = JSON.parse(
  readFileSync(join(root, "data/pisterajat/pisterajat-2026-kevat-yliopisto.json"), "utf8"),
) as CutoffSchool[];
const yliopisto2025 = JSON.parse(
  readFileSync(join(root, "data/pisterajat/pisterajat-2025-syksy-yliopisto.json"), "utf8"),
) as CutoffSchool[];

const scored2026 = calculateUniversityPrograms(GRADES, "2026-kevat", catalogs, yliopisto2026);
const english2026 = scored2026.programs.find(
  (program) => program.university === "Helsingin yliopisto" && program.program.startsWith("Englanti, kielten"),
);
assert.ok(english2026);
assert.equal(english2026.score, 122.3);
assert.equal(english2026.kynnysehtoPassed, true);

const listed2025 = listUniversityPrograms("2025-syksy", catalogs, yliopisto2025);
assert.ok(listed2025.some((program) => program.eligible && program.scoringModelId === undefined));
const venajaIssue = crosswalk.sourceIssues?.find((issue) => issue.type === "cutoff-exceeds-model-maximum");
assert.ok(venajaIssue);
assert.equal(typeof venajaIssue.university, "string");
assert.equal(typeof venajaIssue.program, "string");
const venaja2025 = listed2025.find(
  (program) => program.university === venajaIssue.university && program.program === venajaIssue.program,
);
if (venaja2025) {
  assert.ok(venaja2025.cutoffs.length > 0, "historical cutoffs must not be cleared by 2026 sourceIssue");
}
const listed2026 = listUniversityPrograms("2026-kevat", catalogs, yliopisto2026);
const venaja2026 = listed2026.find(
  (program) => program.university === venajaIssue.university && program.program === venajaIssue.program,
);
assert.ok(venaja2026);
assert.equal(venaja2026.cutoffs.length, 0, "2026-kevat cutoffs must be cleared by top-level sourceIssues");

console.log("todistusvalinta.test.ts: ok");
