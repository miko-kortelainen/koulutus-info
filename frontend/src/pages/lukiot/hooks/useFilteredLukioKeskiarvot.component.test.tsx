import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import useFilteredLukioSchools, { filterLukioSchools } from "@/pages/lukiot/hooks/useFilteredLukioKeskiarvot";
import { LUKIO_KUNTA_ALL, uniqueLukioKunnat } from "@/pages/lukiot/lib/lukioKunnat";
import { type LukioSortOption, parseOmaKeskiarvo } from "@/pages/lukiot/lib/sortLukioKeskiarvot";

const entries: LukioKeskiarvoEntry[] = [
  {
    kunta: "Vårdö",
    koulu: "Örnsköldsviks gymnasium",
    linja: "Gymnasiets allmänna linje",
    alinKeskiarvo: 7.5,
    yleislinja: true,
  },
  { kunta: "Äänekoski", koulu: "Äänekosken lukio", linja: "Lukion yleislinja", alinKeskiarvo: 7.0, yleislinja: true },
  { kunta: "Akaa", koulu: "Akaan lukio", linja: "Lukion yleislinja", alinKeskiarvo: 7.0, yleislinja: true },
  { kunta: "Akaa", koulu: "Akaan lukio", linja: "Lukion urheilulinja", alinKeskiarvo: 15.83, yleislinja: false },
  {
    kunta: "Brändö",
    koulu: "Brändö gymnasium",
    linja: "Gymnasiets allmänna linje",
    alinKeskiarvo: 8.33,
    yleislinja: true,
  },
  { kunta: "Akaa", koulu: "Erityislukio", linja: "Lukion urheilulinja", alinKeskiarvo: 12, yleislinja: false },
  { kunta: "Helsinki", koulu: "Steiner-lukio", linja: "Lukion yleislinja", alinKeskiarvo: 8.0, yleislinja: true },
  { kunta: "Espoo", koulu: "Steiner-lukio", linja: "Lukion urheilulinja", alinKeskiarvo: 14.0, yleislinja: false },
];

const names = (groups: { koulu: string }[]) => groups.map((group) => group.koulu);

test("shows erityislinjat and erityis-only schools when enabled", () => {
  const filtered = filterLukioSchools(entries, "", null, true, "school_asc");
  expect(names(filtered)).toEqual([
    "Akaan lukio",
    "Brändö gymnasium",
    "Erityislukio",
    "Steiner-lukio",
    "Äänekosken lukio",
    "Örnsköldsviks gymnasium",
  ]);
  expect(filtered.find((group) => group.koulu === "Akaan lukio")?.entries).toHaveLength(2);
});

test("hides erityislinjat and schools without yleislinja when disabled", () => {
  const filtered = filterLukioSchools(entries, "", null, false, "school_asc");
  expect(names(filtered)).toEqual([
    "Akaan lukio",
    "Brändö gymnasium",
    "Steiner-lukio",
    "Äänekosken lukio",
    "Örnsköldsviks gymnasium",
  ]);
  expect(filtered.find((group) => group.koulu === "Akaan lukio")?.entries.map((entry) => entry.linja)).toEqual([
    "Lukion yleislinja",
  ]);
});

test("marks yleislinja reachability without changing selected order", () => {
  const filtered = filterLukioSchools(entries, "", 7.5, false, "score_desc");
  expect(names(filtered)).toEqual([
    "Brändö gymnasium",
    "Steiner-lukio",
    "Örnsköldsviks gymnasium",
    "Akaan lukio",
    "Äänekosken lukio",
  ]);
  expect(filtered.map((group) => group.reachable)).toEqual([false, false, true, true, true]);
});

test.each<[LukioSortOption, string[]]>([
  ["school_desc", ["Örnsköldsviks gymnasium", "Äänekosken lukio", "Steiner-lukio", "Brändö gymnasium", "Akaan lukio"]],
  ["score_asc", ["Akaan lukio", "Äänekosken lukio", "Örnsköldsviks gymnasium", "Steiner-lukio", "Brändö gymnasium"]],
  ["score_desc", ["Brändö gymnasium", "Steiner-lukio", "Örnsköldsviks gymnasium", "Akaan lukio", "Äänekosken lukio"]],
])("sorts schools by %s using yleislinja score only", (sortOrder, expected) => {
  const filtered = filterLukioSchools(entries, "", 7.5, false, sortOrder);
  expect(names(filtered)).toEqual(expected);
});

test("sorts erityis-only schools last for score orders", () => {
  const filtered = filterLukioSchools(entries, "", null, true, "score_asc");
  expect(names(filtered).at(-1)).toBe("Erityislukio");
});

test("parses Finnish decimal commas for oma keskiarvo", () => {
  expect(parseOmaKeskiarvo("7,50")).toBe(7.5);
  expect(parseOmaKeskiarvo("")).toBeNull();
  expect(parseOmaKeskiarvo("abc")).toBeNull();
});

test("searches koulu and linja without mutating the source", () => {
  const { result, rerender } = renderHook(
    ({
      searchTerm,
      omaKeskiarvo,
      showErityislinjat,
      sortOrder,
    }: {
      searchTerm: string;
      omaKeskiarvo: number | null;
      showErityislinjat: boolean;
      sortOrder: LukioSortOption;
    }) => useFilteredLukioSchools(entries, searchTerm, omaKeskiarvo, showErityislinjat, sortOrder, LUKIO_KUNTA_ALL),
    {
      initialProps: {
        searchTerm: "  Akaa  ",
        omaKeskiarvo: null as number | null,
        showErityislinjat: true,
        sortOrder: "school_asc" as LukioSortOption,
      },
    },
  );

  expect(names(result.current)).toEqual(["Akaan lukio"]);

  rerender({ searchTerm: "urheilu", omaKeskiarvo: null, showErityislinjat: true, sortOrder: "school_asc" });
  expect(names(result.current)).toEqual(["Akaan lukio", "Erityislukio", "Steiner-lukio"]);
  expect(entries).toHaveLength(8);
});

test("lists kunnat in Finnish alphabetical order including Å, Ä and Ö", () => {
  expect(uniqueLukioKunnat(entries)).toEqual(["Akaa", "Brändö", "Espoo", "Helsinki", "Vårdö", "Äänekoski"]);
});

test("filters schools by kunta and keeps only matching linjat", () => {
  expect(names(filterLukioSchools(entries, "", null, true, "school_asc", "Akaa"))).toEqual([
    "Akaan lukio",
    "Erityislukio",
  ]);
  expect(names(filterLukioSchools(entries, "", null, true, "school_asc", "Brändö"))).toEqual(["Brändö gymnasium"]);
  expect(names(filterLukioSchools(entries, "", null, true, "school_asc", "Vårdö"))).toEqual([
    "Örnsköldsviks gymnasium",
  ]);
  expect(
    filterLukioSchools(entries, "", null, true, "school_asc", "Helsinki")[0]?.entries.map((entry) => entry.linja),
  ).toEqual(["Lukion yleislinja"]);
  expect(
    filterLukioSchools(entries, "", null, true, "school_asc", "Espoo")[0]?.entries.map((entry) => entry.linja),
  ).toEqual(["Lukion urheilulinja"]);
  expect(names(filterLukioSchools(entries, "Akaa", null, true, "school_asc", "Brändö"))).toEqual([]);
  expect(names(filterLukioSchools(entries, "", null, true, "school_asc", LUKIO_KUNTA_ALL))).toHaveLength(6);
});
