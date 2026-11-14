import { expect, test } from "vitest";
import type { AmmattiPalkkaItem, KoulutusalaPalkkaItem, TyollistyminenItem } from "@/api/dataValidation";
import {
  averageEmployment,
  filterAndSortFieldRows,
  filterAndSortOccupations,
  getOccupationGroups,
  mergeFieldRows,
  salaryRange,
  searchOccupations,
  totalEmployed,
} from "@/pages/tyollistyminen/lib/tyollistyminen";

const employmentItems: TyollistyminenItem[] = [
  {
    ala: "Tekniikan alat",
    amk: { paatoimisetTyolliset: 73, tyollisetOpiskelijat: 16, paatoimisetOpiskelijat: 2, tyottomat: 7, muut: 2 },
    alempi: { paatoimisetTyolliset: 61, tyollisetOpiskelijat: 24, paatoimisetOpiskelijat: 8, tyottomat: 7, muut: 1 },
    ylempi: { paatoimisetTyolliset: 77, tyollisetOpiskelijat: 15, paatoimisetOpiskelijat: 1, tyottomat: 5, muut: 3 },
    yamk: { paatoimisetTyolliset: 88, tyollisetOpiskelijat: 8, paatoimisetOpiskelijat: 1, tyottomat: 3, muut: 1 },
  },
  {
    ala: "Luonnontieteet",
    amk: { paatoimisetTyolliset: 67, tyollisetOpiskelijat: 18, paatoimisetOpiskelijat: 5, tyottomat: 8, muut: 3 },
    alempi: { paatoimisetTyolliset: 45, tyollisetOpiskelijat: 31, paatoimisetOpiskelijat: 13, tyottomat: 9, muut: 3 },
    ylempi: { paatoimisetTyolliset: 57, tyollisetOpiskelijat: 32, paatoimisetOpiskelijat: 3, tyottomat: 4, muut: 5 },
    yamk: null,
  },
];

const salaryItems: KoulutusalaPalkkaItem[] = [
  { ala: "Tekniikan alat", toinenAste: 3376, alempiKorkeakoulu: 4652, ylempiKorkeakoulu: 5584 },
  { ala: "Luonnontieteet", toinenAste: null, alempiKorkeakoulu: 3500, ylempiKorkeakoulu: 4586 },
];

const occupationItems: AmmattiPalkkaItem[] = [
  { koodi: "1", nimi: "Johtajat", paaryhma: "Johtajat", ylaryhma: null, mediaaniPalkka: 7481, onRyhma: true },
  {
    koodi: "2144",
    nimi: "Konetekniikan erityisasiantuntijat",
    paaryhma: "Erityisasiantuntijat",
    ylaryhma: "Tekniikan erityisasiantuntijat",
    mediaaniPalkka: 4702,
    onRyhma: false,
  },
  {
    koodi: "22121",
    nimi: "Ylilääkärit",
    paaryhma: "Erityisasiantuntijat",
    ylaryhma: "Ylilääkärit ja erikoislääkärit",
    mediaaniPalkka: 10795,
    onRyhma: false,
  },
  {
    koodi: "2113",
    nimi: "Kemistit",
    paaryhma: "Erityisasiantuntijat",
    ylaryhma: "Luonnon- ja geotieteen erityisasiantuntijat",
    mediaaniPalkka: 4535,
    onRyhma: false,
  },
];

test("computes totalEmployed, averageEmployment, and salaryRange", () => {
  expect(totalEmployed(employmentItems[0].amk)).toBe(89);
  expect(totalEmployed(null)).toBeNull();
  expect(averageEmployment(employmentItems[0])).toBe(91);
  expect(averageEmployment(employmentItems[1])).toBe(83);
  expect(salaryRange(salaryItems[0])).toEqual({ min: 3376, max: 5584 });
  expect(salaryRange(salaryItems[1])).toEqual({ min: 3500, max: 4586 });
});

test("merges, filters, and sorts study field rows including curated occupations", () => {
  const merged = mergeFieldRows(employmentItems, salaryItems, occupationItems);
  expect(merged[0].occupations.map((item) => item.nimi)).toEqual(["Konetekniikan erityisasiantuntijat"]);
  expect(merged[1].occupations.map((item) => item.nimi)).toEqual(["Kemistit"]);

  expect(filterAndSortFieldRows(merged, "", "a-o").map((row) => row.ala)).toEqual(["Luonnontieteet", "Tekniikan alat"]);
  expect(filterAndSortFieldRows(merged, "", "o-a").map((row) => row.ala)).toEqual(["Tekniikan alat", "Luonnontieteet"]);
  expect(filterAndSortFieldRows(merged, "", "tyollisyys").map((row) => row.ala)).toEqual([
    "Tekniikan alat",
    "Luonnontieteet",
  ]);
  expect(filterAndSortFieldRows(merged, "", "palkka").map((row) => row.ala)).toEqual([
    "Tekniikan alat",
    "Luonnontieteet",
  ]);
  expect(filterAndSortFieldRows(merged, "kemisti", "a-o").map((row) => row.ala)).toEqual(["Luonnontieteet"]);
});

test("searches specific occupations and excludes group summaries", () => {
  expect(searchOccupations(occupationItems, "lääkäri").map((item) => item.koodi)).toEqual(["22121"]);
  expect(searchOccupations(occupationItems, "johtaja")).toEqual([]);
  expect(searchOccupations(occupationItems, "")).toEqual([]);
});

test("lists occupation groups and filters and sorts occupations", () => {
  expect(getOccupationGroups(occupationItems)).toEqual(["Erityisasiantuntijat"]);
  expect(filterAndSortOccupations(occupationItems, "", "kaikki", "palkka-desc").map((item) => item.koodi)).toEqual([
    "22121",
    "2144",
    "2113",
  ]);
  expect(filterAndSortOccupations(occupationItems, "", "kaikki", "palkka-asc").map((item) => item.koodi)).toEqual([
    "2113",
    "2144",
    "22121",
  ]);
  expect(filterAndSortOccupations(occupationItems, "", "kaikki", "a-o").map((item) => item.nimi)).toEqual([
    "Kemistit",
    "Konetekniikan erityisasiantuntijat",
    "Ylilääkärit",
  ]);
  expect(filterAndSortOccupations(occupationItems, "", "kaikki", "o-a").map((item) => item.nimi)).toEqual([
    "Ylilääkärit",
    "Konetekniikan erityisasiantuntijat",
    "Kemistit",
  ]);
  expect(
    filterAndSortOccupations(occupationItems, "kemisti", "Erityisasiantuntijat", "palkka-desc").map(
      (item) => item.koodi,
    ),
  ).toEqual(["2113"]);
  expect(filterAndSortOccupations(occupationItems, "", "Asiantuntijat", "palkka-desc")).toEqual([]);
});
