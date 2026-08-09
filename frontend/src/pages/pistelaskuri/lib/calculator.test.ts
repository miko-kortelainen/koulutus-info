// Run with: pnpm exec tsx src/pages/pistelaskuri/lib/calculator.test.ts
import assert from "node:assert/strict";
import {
  type AmmFormState,
  emptyAmmFormState,
  isAmmFormState,
  parseAmmForm,
} from "@/pages/pistelaskuri/components/AmmForm";
import {
  flattenAmkPrograms,
  flattenUniversityPrograms,
  matchesScoreType,
  type ScoreResult,
  selectApplicantResults,
} from "@/pages/pistelaskuri/lib/scoreResults";
import { emptyYoFormState, isYoFormState, parseYoForm, toUniversityGrades } from "@/pages/pistelaskuri/lib/yoForm";

const completeYoForm = {
  aineet: [
    { id: 0, subject: "ai_fi" as const, grade: "L" as const },
    { id: 1, subject: "matematiikka-pitka" as const, grade: "E" as const },
    { id: 2, subject: "englanti-pitka" as const, grade: "M" as const },
    { id: 3, subject: "Fysiikka" as const, grade: "C" as const },
  ],
};
assert.ok("input" in parseYoForm(completeYoForm));
assert.deepEqual(toUniversityGrades(completeYoForm), { ai_fi: "L", ena: "M", fy: "C", maa: "E" });
assert.deepEqual(
  toUniversityGrades({
    aineet: [
      { id: 0, subject: "ai_sv" as const, grade: "L" as const },
      { id: 1, subject: "matematiikka-pitka" as const, grade: "E" as const },
      { id: 2, subject: "englanti-pitka" as const, grade: "M" as const },
      { id: 3, subject: "Ortodoksinen uskonto" as const, grade: "C" as const },
    ],
  }),
  { ai_sv: "L", ena: "M", maa: "E", uo: "C" },
);
assert.equal(isYoFormState(completeYoForm), true);
assert.equal(isYoFormState({ aineet: [{ id: 0, subject: "ai_fi" as const, grade: "H" }] }), false);
assert.equal(isYoFormState(emptyYoFormState()), false);

const duplicateLanguage = parseYoForm({
  aineet: [...completeYoForm.aineet, { id: 4, subject: "englanti-lyhyt" as const, grade: "E" as const }],
});
if ("input" in duplicateLanguage) assert.fail("Duplicate language should fail validation.");
assert.equal(duplicateLanguage.errors.aineet, "Saman aineen voi lisätä vain kerran.");

const completeAmmForm: AmmFormState = {
  ...emptyAmmFormState(),
  grades: [3, 2, 1],
  keskiarvoInput: "2,81",
  scale: "1-3",
};
const parsedAmm = parseAmmForm(completeAmmForm);
assert.ok("input" in parsedAmm);
assert.deepEqual(parsedAmm.input, {
  communication: 3,
  gradeScale: 3,
  mathematicsSciences: 2,
  societyWork: 1,
  weightedAverage: 2.81,
});
assert.equal(isAmmFormState(completeAmmForm), true);
assert.equal(isAmmFormState({ ...completeAmmForm, scale: "bogus" }), false);

const universityResult = (selectionMethod: string) => ({ sector: "Yliopistokoulutus", selectionMethod });
const amkResult = (selectionMethod: string) => ({ sector: "Ammattikorkeakoulukoulutus", selectionMethod });
assert.equal(matchesScoreType(universityResult("Todistusvalinta"), "Todistusvalinta (YO)"), true);
assert.equal(matchesScoreType(universityResult("Todistusvalinta"), "Todistusvalinta (AMM)"), false);
assert.equal(matchesScoreType(amkResult("Todistusvalinta (YO)"), "Todistusvalinta (YO)"), true);
assert.equal(matchesScoreType(amkResult("Todistusvalinta (AMM)"), "Todistusvalinta (AMM)"), true);

const scoreResult = (selectionMethod: string, score: number): ScoreResult => ({
  id: `${selectionMethod}\0${score}`,
  koulutusala: "Testiala",
  programmeName: "Testiohjelma",
  schoolName: "Testikoulu",
  score,
  sector: "Yliopistokoulutus",
  selectionMethod,
});
const selected = selectApplicantResults(
  [scoreResult("Todistusvalinta", 120), scoreResult("Todistusvalinta", 110)],
  "Todistusvalinta (YO)",
  false,
);
assert.equal(selected.length, 1);
assert.equal(selected[0].score, 110);

const universityPrograms = flattenUniversityPrograms({
  applicationRound: "2026-kevat",
  programs: [
    {
      cutoffs: [
        { score: 108.8, selectionMethod: "Todistusvalinta", startSeason: "Syksy", startYear: 2026 },
        { score: 102.2, selectionMethod: "Todistusvalinta", startSeason: "Syksy", startYear: 2026 },
      ],
      eligible: true,
      field: "Humanistiset alat",
      kynnysehtoLabel: "Hyväksytty englannin koe.",
      program: "Saksan kieli ja kulttuuri",
      score: 120,
      university: "Oulun yliopisto",
    },
  ],
});
assert.equal(universityPrograms.length, 2);
assert.notEqual(universityPrograms[0].id, universityPrograms[1].id);
assert.equal(universityPrograms[0].applicantScore, 120);
assert.equal(universityPrograms[0].kynnysehtoLabel, "Hyväksytty englannin koe.");

const amkPrograms = flattenAmkPrograms({
  applicationRound: "2026-kevat",
  ammattikorkeakoulut: [
    {
      name: "Testi-AMK",
      programmes: [
        {
          cutoffs: [{ score: 80, selectionMethod: "Todistusvalinta (AMM)", startSeason: "Syksy", startYear: 2026 }],
          koulutusala: "Testiala",
          name: "Testiohjelma",
        },
      ],
      sector: "Ammattikorkeakoulukoulutus",
    },
  ],
  maximumScore: 150,
  score: 90,
});
assert.equal(amkPrograms[0].applicantScore, 90);

console.log("calculator.test.ts: OK");
