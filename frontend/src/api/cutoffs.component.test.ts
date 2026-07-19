import { expect, test } from "vitest";
import type { Programme, School as CutoffSchool } from "@/types/pisterajat.gen";
import type { SchoolsResponse } from "@/types.gen";
import {
  alaNamesForAlaParam,
  alaSlugParam,
  filterUnavailableCutoffAlat,
  filterProgrammesByAlaParam,
  mergeCutoffProgrammes,
  newestCutoffRoundForAlaParam,
} from "./cutoffs";

const programme = (name: string, koulutusala: string): Programme => ({
  name,
  koulutusala,
  cutoffs: [{ selectionMethod: "Todistusvalinta (YO)", score: 100, startYear: 2026, startSeason: "Syksy" }],
});

const programmes = [
  programme("Kauppatieteet", "Kauppa, hallinto ja oikeustieteet"),
  programme("Kätilö", "Terveys- ja hyvinvointialat"),
];

test("alaSlugParam encodes ala names as comma-separated slugs", () => {
  expect(alaSlugParam(["Kauppa, hallinto ja oikeustieteet", "Palvelualat"])).toBe(
    "kauppa-hallinto-ja-oikeustieteet,palvelualat",
  );
});

test("filterProgrammesByAlaParam matches an ala name containing a comma", () => {
  const filtered = filterProgrammesByAlaParam(programmes, "kauppa-hallinto-ja-oikeustieteet");

  expect(filtered.map((p) => p.name)).toEqual(["Kauppatieteet"]);
});

test("filterProgrammesByAlaParam matches multiple alat and ignores unknown slugs", () => {
  const filtered = filterProgrammesByAlaParam(programmes, "palvelualat,terveys-ja-hyvinvointialat,tuntematon");

  expect(filtered.map((p) => p.name)).toEqual(["Kätilö"]);
});

test("alaNamesForAlaParam resolves display names for the matched slugs only", () => {
  expect(alaNamesForAlaParam(programmes, "kauppa-hallinto-ja-oikeustieteet,tuntematon")).toEqual([
    "Kauppa, hallinto ja oikeustieteet",
  ]);
});

test("newestCutoffRoundForAlaParam chooses the newest round containing the requested ala", () => {
  const merged = mergeCutoffProgrammes([
    { programme: programme("Kätilö", "Terveys- ja hyvinvointialat"), round: "2026-kevat" },
    { programme: programme("Kauppatieteet", "Kauppa, hallinto ja oikeustieteet"), round: "2025-syksy" },
    { programme: programme("Kauppatieteet", "Kauppa, hallinto ja oikeustieteet"), round: "2025-kevat" },
  ]);

  expect(newestCutoffRoundForAlaParam(merged, "kauppa-hallinto-ja-oikeustieteet")).toBe("2025-syksy");
});

test("filterUnavailableCutoffAlat removes school and ala combinations without cutoff data", () => {
  const schools: SchoolsResponse = [
    {
      nimi: { fi: "Musiikki" },
      sektori: "amk",
      tutkintotaso: "ylempi",
      toteutukset: [
        {
          toteutusOid: "1",
          toteutusNimi: { fi: "Musiikin ylempi tutkinto-ohjelma" },
          oppilaitosNimi: { fi: "Testi-AMK" },
          kunnat: ["Tampere"],
          koulutusalat: ["Kasvatusalat", "Taiteet ja kulttuurialat"],
        },
      ],
    },
  ];
  const cutoffSchools: CutoffSchool[] = [
    {
      name: "Testi-AMK",
      sector: "Ammattikorkeakoulukoulutus",
      programmes: [programme("Musiikki", "Taiteet ja kulttuurialat")],
    },
  ];

  expect(filterUnavailableCutoffAlat(schools, cutoffSchools)[0].toteutukset[0].koulutusalat).toEqual([
    "Taiteet ja kulttuurialat",
  ]);
});

test("mergeCutoffProgrammes merges one programme across rounds and tags each cutoff", () => {
  const merged = mergeCutoffProgrammes([
    { programme: programme("Kätilö", "Terveys- ja hyvinvointialat"), round: "2026-kevat" },
    { programme: programme("Kätilö", "Terveys- ja hyvinvointialat"), round: "2025-syksy" },
    { programme: programme("Kauppatieteet", "Kauppa, hallinto ja oikeustieteet"), round: "2026-kevat" },
  ]);

  expect(merged.map((p) => p.name)).toEqual(["Kätilö", "Kauppatieteet"]);
  expect(merged[0].cutoffs.map((c) => c.round)).toEqual(["2026-kevat", "2025-syksy"]);
});
