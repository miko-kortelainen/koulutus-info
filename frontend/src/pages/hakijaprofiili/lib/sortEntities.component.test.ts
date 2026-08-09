import { expect, test } from "vitest";
import type { HakijaprofiiliEntity } from "@/api/dataValidation";
import { type SortOption, sortEntities } from "@/pages/hakijaprofiili/lib/sortEntities";

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
  ["most_female", ["Beta", "Alpha", "Delta", "Gamma"]],
  ["most_male", ["Gamma", "Alpha", "Beta", "Delta"]],
  ["most_female_count", ["Beta", "Alpha", "Delta", "Gamma"]],
  ["most_male_count", ["Alpha", "Gamma", "Beta", "Delta"]],
  ["least_female_count", ["Delta", "Gamma", "Alpha", "Beta"]],
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

test("tie-breaks equal gender shares with Finnish name ascending", () => {
  const tied = [entity("Örebro", 100, 10), entity("Åbo", 100, 10), entity("Beta", 100, 10)];

  expect(names(sortEntities(tied, "most_female"))).toEqual(["Beta", "Åbo", "Örebro"]);
});

test("share denominator includes other publishable genders", () => {
  const withMuu = entity("Muu mukana", 50, 40, [{ nimi: "muu", lkm: 10 }]);
  const withoutMuu = entity("Ilman muuta", 90, 10);

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
