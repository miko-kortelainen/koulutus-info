import { expect, test } from "vitest";
import type { HakijaprofiiliEntity } from "@/api/dataValidation";
import { genderShare, publishableGenderCount, type SortOption, sortEntities } from "./sortEntities";

const entity = (
  kohdeNimi: string,
  nainen: number | null,
  mies: number | null,
  extras: { nimi: string; lkm: number | null }[] = [],
): HakijaprofiiliEntity => ({
  kohdeTyyppi: "koulu",
  kohdeNimi,
  sukupuoli: [{ nimi: "Nainen", lkm: nainen }, { nimi: "Mies", lkm: mies }, ...extras],
  ikaryhmat: [],
});

const entities: HakijaprofiiliEntity[] = [
  entity("Beta", 100, 10),
  entity("Alpha", 50, 200),
  entity("Gamma", null, 80),
  entity("Delta", 3, null),
];

const names = (items: HakijaprofiiliEntity[]) => items.map((item) => item.kohdeNimi);

test.each<[SortOption, string[]]>([
  ["asc", ["Alpha", "Beta", "Delta", "Gamma"]],
  ["desc", ["Gamma", "Delta", "Beta", "Alpha"]],
  // Beta 100/110≈91%, Alpha 50/250=20%; Gamma/Delta missing nainen → last (Finnish A–Ö)
  ["most_female", ["Beta", "Alpha", "Delta", "Gamma"]],
  // Gamma 80/80=100%, Alpha 200/250=80%, Beta 10/110≈9%; Delta missing mies
  ["most_male", ["Gamma", "Alpha", "Beta", "Delta"]],
  // Absolute nainen: Beta 100, Alpha 50; Gamma/Delta missing → last
  ["most_female_count", ["Beta", "Alpha", "Delta", "Gamma"]],
  // Absolute mies: Alpha 200, Gamma 80, Beta 10; Delta missing
  ["most_male_count", ["Alpha", "Gamma", "Beta", "Delta"]],
  // Absolute nainen ascending: Delta/Gamma missing→0, Alpha 50, Beta 100
  ["least_female_count", ["Delta", "Gamma", "Alpha", "Beta"]],
  // Absolute mies ascending: Delta missing→0, Beta 10, Gamma 80, Alpha 200
  ["least_male_count", ["Delta", "Beta", "Gamma", "Alpha"]],
])("sorts entities with %s without mutating the source", (sortOrder, expected) => {
  expect(names(sortEntities(entities, sortOrder))).toEqual(expected);
  expect(names(entities)).toEqual(["Beta", "Alpha", "Gamma", "Delta"]);
});

test("uses Finnish alphabetical order", () => {
  const fixture = ["Örebro", "Åbo", "Äänekoski", "Zeta"].map((name) => entity(name, 10, 10));

  expect(names(sortEntities(fixture, "asc"))).toEqual(["Zeta", "Åbo", "Äänekoski", "Örebro"]);
  expect(names(sortEntities(fixture, "desc"))).toEqual(["Örebro", "Äänekoski", "Åbo", "Zeta"]);
});

test("treats under-five gender counts as missing for ordering", () => {
  expect(publishableGenderCount(entity("X", 4, 5), "nainen")).toBeNull();
  expect(publishableGenderCount(entity("X", 4, 5), "mies")).toBe(5);
  expect(publishableGenderCount(entity("X", null, 2), "mies")).toBeNull();
  expect(genderShare(entity("X", 4, 5), "nainen")).toBeNull();
  expect(genderShare(entity("X", 4, 5), "mies")).toBe(1);
});

test("tie-breaks equal gender shares with Finnish name ascending", () => {
  const tied = [entity("Örebro", 100, 10), entity("Åbo", 100, 10), entity("Beta", 100, 10)];

  expect(names(sortEntities(tied, "most_female"))).toEqual(["Beta", "Åbo", "Örebro"]);
});

test("share denominator includes other publishable genders", () => {
  // 50 nainen / (50 + 40 + 10) = 50%; 90 nainen / (90 + 10) = 90%
  const withMuu = entity("Muu mukana", 50, 40, [{ nimi: "muu", lkm: 10 }]);
  const withoutMuu = entity("Ilman muuta", 90, 10);

  expect(genderShare(withMuu, "nainen")).toBe(0.5);
  expect(names(sortEntities([withMuu, withoutMuu], "most_female"))).toEqual(["Ilman muuta", "Muu mukana"]);
});

test.each<[SortOption, string[]]>([
  ["most_male", ["Julkaistu", "Alle viisi", "Peitetty"]],
  ["most_male_count", ["Julkaistu", "Alle viisi", "Peitetty"]],
  ["least_male_count", ["Alle viisi", "Peitetty", "Julkaistu"]],
])("sorts masked counts with %s", (sortOrder, expected) => {
  const fixture = [entity("Peitetty", 100, null), entity("Alle viisi", 100, 4), entity("Julkaistu", 50, 80)];

  expect(names(sortEntities(fixture, sortOrder))).toEqual(expected);
});
