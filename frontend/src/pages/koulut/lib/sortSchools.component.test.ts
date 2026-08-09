import { expect, test } from "vitest";
import type { SchoolListItem } from "@/pages/koulut/+data";
import sortSchools, { type SortOption } from "@/pages/koulut/lib/sortSchools";

const schools: SchoolListItem[] = [
  {
    name: "Alpha",
    slug: "alpha",
    sektori: "Yliopistokoulutus",
    koulutuksia: 1,
    kaikkiHakijat: 100,
    valitut: 20,
    ensisijaisetHakijat: 30,
    aloituspaikat: 10,
    feedbackAverage: 4.1,
    feedbackMaxScore: 5,
  },
  {
    name: "Beta",
    slug: "beta",
    sektori: "Yliopistokoulutus",
    koulutuksia: 1,
    kaikkiHakijat: 300,
    valitut: 30,
    ensisijaisetHakijat: 10,
    aloituspaikat: 10,
    feedbackAverage: 3.2,
    feedbackMaxScore: 5,
  },
  {
    name: "Gamma",
    slug: "gamma",
    sektori: "Yliopistokoulutus",
    koulutuksia: 1,
    kaikkiHakijat: 200,
    valitut: 40,
    ensisijaisetHakijat: 20,
    aloituspaikat: 10,
    feedbackAverage: null,
    feedbackMaxScore: null,
  },
];

const names = (items: SchoolListItem[]) => items.map((item) => item.name);

test.each<[SortOption, string[]]>([
  ["asc", ["Alpha", "Beta", "Gamma"]],
  ["desc", ["Gamma", "Beta", "Alpha"]],
  ["most_popular", ["Beta", "Gamma", "Alpha"]],
  ["least_popular", ["Alpha", "Gamma", "Beta"]],
  ["most_first_choice", ["Alpha", "Gamma", "Beta"]],
  ["least_first_choice", ["Beta", "Gamma", "Alpha"]],
  ["highest_feedback", ["Alpha", "Beta", "Gamma"]],
  ["lowest_feedback", ["Beta", "Alpha", "Gamma"]],
])("sorts schools with %s without mutating the source", (sortOrder, expected) => {
  expect(names(sortSchools(schools, sortOrder))).toEqual(expected);
  expect(names(schools)).toEqual(["Alpha", "Beta", "Gamma"]);
});

test("uses Finnish alphabetical order", () => {
  const fixture = ["Örebro", "Åbo", "Äänekoski", "Zeta"].map((name) => ({ ...schools[0], name, slug: name }));

  expect(names(sortSchools(fixture, "asc"))).toEqual(["Zeta", "Åbo", "Äänekoski", "Örebro"]);
});
