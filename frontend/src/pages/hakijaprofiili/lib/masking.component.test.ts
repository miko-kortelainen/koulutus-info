import { expect, test } from "vitest";
import { canShowShares, formatGenderCount, publishableCounts, sortAgeBands } from "@/pages/hakijaprofiili/lib/masking";

test("formats null and under-five gender counts as 1-4 hakijaa", () => {
  expect(formatGenderCount(null)).toBe("1-4 hakijaa");
  expect(formatGenderCount(2)).toBe("1-4 hakijaa");
  expect(formatGenderCount(5)).toBe("5");
  expect(formatGenderCount(1200)).toBe("1\u00a0200");
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

test("blocks %-shares when any part is null or under five", () => {
  expect(
    canShowShares([
      { nimi: "nainen", lkm: 100 },
      { nimi: "mies", lkm: 80 },
    ]),
  ).toBe(true);
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
