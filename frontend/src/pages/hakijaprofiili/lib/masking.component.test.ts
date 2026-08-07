import { expect, test } from "vitest";
import {
  canShowShares,
  formatGenderCount,
  formatProfiliCount,
  genderRowsForDisplay,
  hasPublishableProfili,
  publishableCounts,
  sortAgeBands,
} from "./masking";

test("formats null and under-five counts as alle 5", () => {
  expect(formatProfiliCount(null)).toBe("alle 5");
  expect(formatProfiliCount(2)).toBe("alle 5"); // imputed midpoint from flat 1-4
  expect(formatProfiliCount(4)).toBe("alle 5");
  expect(formatProfiliCount(5)).toBe("5");
  expect(formatProfiliCount(1200)).toBe("1\u00a0200");
});

test("formats null and under-five gender counts as 1-4 hakijaa", () => {
  expect(formatGenderCount(null)).toBe("1-4 hakijaa");
  expect(formatGenderCount(2)).toBe("1-4 hakijaa");
  expect(formatGenderCount(4)).toBe("1-4 hakijaa");
  expect(formatGenderCount(5)).toBe("5");
  expect(formatGenderCount(1200)).toBe("1\u00a0200");
});

test("genderRowsForDisplay always returns nainen then mies, filling missing as null", () => {
  expect(genderRowsForDisplay([{ nimi: "Mies", lkm: 10 }])).toEqual([
    { nimi: "nainen", lkm: null },
    { nimi: "mies", lkm: 10 },
  ]);
  expect(genderRowsForDisplay([])).toEqual([
    { nimi: "nainen", lkm: null },
    { nimi: "mies", lkm: null },
  ]);
});

test("keeps only published counts (lkm >= 5) for bar lists", () => {
  expect(
    publishableCounts([
      { nimi: "nainen", lkm: 100 },
      { nimi: "mies", lkm: 2 },
      { nimi: "muu", lkm: null },
      { nimi: "tuntematon", lkm: 5 },
    ]).map((row) => row.nimi),
  ).toEqual(["nainen", "tuntematon"]);
});

test("hasPublishableProfili is false only when both breakdowns are empty after publishableCounts", () => {
  expect(
    hasPublishableProfili({
      sukupuoli: [
        { nimi: "mies", lkm: null },
        { nimi: "nainen", lkm: 2 },
      ],
      ikaryhmat: [
        { nimi: "19", lkm: 4 },
        { nimi: "20", lkm: null },
      ],
    }),
  ).toBe(false);
  expect(
    hasPublishableProfili({
      sukupuoli: [{ nimi: "nainen", lkm: 5 }],
      ikaryhmat: [{ nimi: "19", lkm: null }],
    }),
  ).toBe(true);
  expect(
    hasPublishableProfili({
      sukupuoli: [{ nimi: "nainen", lkm: 3 }],
      ikaryhmat: [{ nimi: "19", lkm: 10 }],
    }),
  ).toBe(true);
});

test("allows %-shares when every remaining part is published (lkm ≥ 5)", () => {
  expect(
    canShowShares([
      { nimi: "nainen", lkm: 100 },
      { nimi: "mies", lkm: 80 },
    ]),
  ).toBe(true);
});

test("blocks %-shares when any part is null or under five", () => {
  expect(
    canShowShares([
      { nimi: "nainen", lkm: 100 },
      { nimi: "mies", lkm: null },
    ]),
  ).toBe(false);
  expect(
    canShowShares([
      { nimi: "nainen", lkm: 100 },
      { nimi: "mies", lkm: 2 },
    ]),
  ).toBe(false);
  expect(canShowShares([])).toBe(false);
});

test("orders rows largest→smallest by numeric lkm, null last, Finnish name on ties", () => {
  const sorted = sortAgeBands([
    { nimi: "Ö-ikä", lkm: 10 },
    { nimi: "21", lkm: null },
    { nimi: "19", lkm: 250 },
    { nimi: "Å-ikä", lkm: 10 },
    { nimi: "20", lkm: 2 },
  ]);
  expect(sorted.map((row) => row.nimi)).toEqual(["19", "Å-ikä", "Ö-ikä", "20", "21"]);
});
