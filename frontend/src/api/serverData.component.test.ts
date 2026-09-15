import { expect, test, vi } from "vitest";

const fsMock = vi.hoisted(() => ({
  readFileSync: vi.fn(),
  readdirSync: vi.fn(),
  statSync: vi.fn(),
}));

vi.mock("node:fs", () => ({ default: fsMock }));

import {
  availableCutoffRounds,
  cutoffAlaNames,
  cutoffSchoolNames,
  feedbackSchoolNames,
  formatSchoolName,
  lukioSchoolNames,
  readAllPrograms,
  readCurrentYearStatistics,
  readHakijaprofiili,
  readKoulutustarpeet,
  readLukioKeskiarvotForSchool,
  readMeta,
  readStudentFeedback,
  resolveLukioSchool,
  resolveSchool,
  schoolNames,
} from "@/api/serverData";

let revision = 0;

function useDataFiles(files: Record<string, unknown>) {
  revision += 1;
  const fileFromPath = (path: unknown) => String(path).split("/public/data/")[1];

  fsMock.readFileSync.mockReset();
  fsMock.readdirSync.mockReset();
  fsMock.statSync.mockReset();
  fsMock.readFileSync.mockImplementation((path) => {
    const file = fileFromPath(path);
    if (!(file in files)) throw new Error(`Missing test data: ${file}`);
    return JSON.stringify(files[file]);
  });
  fsMock.readdirSync.mockReturnValue(
    Object.keys(files)
      .filter((file) => file.startsWith("pisterajat/") && !file.slice("pisterajat/".length).includes("/"))
      .map((file) => file.slice("pisterajat/".length)),
  );
  fsMock.statSync.mockImplementation((path) => {
    const file = fileFromPath(path);
    if (!(file in files)) throw new Error(`Missing test data: ${file}`);
    return { mtimeMs: revision };
  });
}

const meta = {
  currentStatisticsRound: "2026_syksy",
  generatedAt: "2026-09-14T22:14:35Z",
  statisticsRounds: ["2026_syksy"],
};

const feedback = {
  koulutusalat: {},
  tilastot: { keskihajonta: 1, keskiarvo: 4, vastaajatLkm: 10 },
};

const cutoffSchool = (name: string, koulutusala: string) => ({
  name,
  programmes: [
    {
      cutoffs: [{ score: 80, selectionMethod: "Todistusvalinta", startSeason: "Syksy", startYear: 2026 }],
      koulutusala,
      name: `${koulutusala} koulutus`,
    },
  ],
  sector: "Yliopistokoulutus",
});

test("formats school names from the catalog", () => {
  useDataFiles({
    "schools.json": [
      { name: "Yrkeshögskolan Arcada", shortName: "Arcada" },
      { name: "Yrkeshögskolan Novia", shortName: "Novia" },
      { name: "Åbo Akademi", shortName: "ÅA" },
      { name: "Svenska handelshögskolan", shortName: "Hanken" },
      { name: "Helsingin yliopisto" },
      { name: "Tampereen ammattikorkeakoulu", shortName: "TAMK" },
    ],
  });

  expect(formatSchoolName("Yrkeshögskolan Arcada")).toBe("Yrkeshögskolan Arcada (Arcada)");
  expect(formatSchoolName("Yrkeshögskolan Novia")).toBe("Yrkeshögskolan Novia (Novia)");
  expect(formatSchoolName("Åbo Akademi")).toBe("Åbo Akademi (ÅA)");
  expect(formatSchoolName("Svenska handelshögskolan")).toBe("Svenska handelshögskolan (Hanken)");
  expect(formatSchoolName("Helsingin yliopisto")).toBe("Helsingin yliopisto");
  expect(formatSchoolName("Tampereen ammattikorkeakoulu")).toBe(
    "Tampereen ammattikorkeakoulu (TAMK)",
  );
});

test("caches parsed files until their modification time changes", () => {
  useDataFiles({ "meta.json": meta });

  expect(readMeta()).toEqual(meta);
  expect(readMeta()).toEqual(meta);
  expect(fsMock.readFileSync).toHaveBeenCalledOnce();

  const updated = { ...meta, generatedAt: "2026-09-15T10:00:00Z" };
  useDataFiles({ "meta.json": updated });
  expect(readMeta()).toEqual(updated);
});

test("discovers cutoff rounds and derives catalog-backed names", () => {
  useDataFiles({
    "pisterajat/notes.txt": "ignored",
    "pisterajat/pisterajat-2025-syksy-amk.json": [cutoffSchool("Ääni-yliopisto", "Kasvatusalat")],
    "pisterajat/pisterajat-2025-syksy-yliopisto.json": [cutoffSchool("Aalto-yliopisto", "Tekniikan alat")],
    "pisterajat/pisterajat-2026-kevat-amk.json": [cutoffSchool("Aalto-yliopisto", "Tekniikan alat")],
    "pisterajat/pisterajat-2026-kevat-yliopisto.json": [cutoffSchool("Ääni-yliopisto", "Kasvatusalat")],
    "schools.json": [{ name: "Ääni-yliopisto" }, { name: "Aalto-yliopisto" }],
  });

  expect(availableCutoffRounds()).toEqual(["2026-kevat", "2025-syksy"]);
  expect(cutoffSchoolNames()).toEqual(["Aalto-yliopisto", "Ääni-yliopisto"]);
  expect(cutoffAlaNames()).toEqual(["Kasvatusalat", "Tekniikan alat"]);
  expect(schoolNames()).toEqual(["Aalto-yliopisto", "Ääni-yliopisto"]);
  expect(resolveSchool("aani-yliopisto")).toEqual({ name: "Ääni-yliopisto" });
});

test("rejects cutoff schools missing from the school catalog", () => {
  useDataFiles({
    "pisterajat/pisterajat-2026-kevat-amk.json": [cutoffSchool("Tuntematon yliopisto", "Tekniikan alat")],
    "pisterajat/pisterajat-2026-kevat-yliopisto.json": [],
    "schools.json": [{ name: "Aalto-yliopisto" }],
  });

  expect(() => cutoffSchoolNames()).toThrow("Cutoff schools missing from school catalog: Tuntematon yliopisto");
});

test("rejects school names that resolve to the same slug", () => {
  useDataFiles({ "schools.json": [{ name: "A B" }, { name: "A-B" }] });

  expect(() => schoolNames()).toThrow("School slug collision");
});

test("merges feedback datasets with their survey metadata", () => {
  useDataFiles({
    "opiskelijapalaute/amk-palaute.json": { "Aalto-ammattikorkeakoulu": feedback },
    "opiskelijapalaute/yliopisto-palaute.json": { "Ääni-yliopisto": feedback },
    "schools.json": [{ name: "Ääni-yliopisto" }, { name: "Aalto-ammattikorkeakoulu" }],
  });

  expect(readStudentFeedback()).toEqual({
    "Aalto-ammattikorkeakoulu": { feedback, maxScore: 7, survey: "avop", year: 2025 },
    "Ääni-yliopisto": { feedback, maxScore: 5, survey: "kandipalaute", year: 2025 },
  });
  expect(feedbackSchoolNames()).toEqual(["Aalto-ammattikorkeakoulu", "Ääni-yliopisto"]);
});

test("rejects a school found in both feedback datasets", () => {
  useDataFiles({
    "opiskelijapalaute/amk-palaute.json": { "Sama koulu": feedback },
    "opiskelijapalaute/yliopisto-palaute.json": { "Sama koulu": feedback },
  });

  expect(() => readStudentFeedback()).toThrow("Student feedback schools found in both datasets: Sama koulu");
});

test("rejects feedback for a school missing from the catalog", () => {
  useDataFiles({
    "opiskelijapalaute/amk-palaute.json": {},
    "opiskelijapalaute/yliopisto-palaute.json": { "Tuntematon yliopisto": feedback },
    "schools.json": [{ name: "Aalto-yliopisto" }],
  });

  expect(() => readStudentFeedback()).toThrow(
    "Student feedback schools missing from school catalog: Tuntematon yliopisto",
  );
});

test("sorts and resolves lukio averages", () => {
  const aLukio = [
    { alinKeskiarvo: 8.5, koulu: "Äänekosken lukio", kunta: "Äänekoski", linja: "Yleislinja", yleislinja: true },
    { alinKeskiarvo: 7.2, koulu: "Äänekosken lukio", kunta: "Äänekoski", linja: "Musiikkilinja", yleislinja: false },
    { alinKeskiarvo: 9, koulu: "Akaan lukio", kunta: "Akaa", linja: "Yleislinja", yleislinja: true },
  ];
  useDataFiles({ "pisterajat/lukio/lukio-keskiarvot-2026.json": aLukio });

  expect(lukioSchoolNames()).toEqual(["Akaan lukio", "Äänekosken lukio"]);
  expect(resolveLukioSchool("aanekosken-lukio")).toBe("Äänekosken lukio");
  expect(readLukioKeskiarvotForSchool("Äänekosken lukio")).toEqual([aLukio[1], aLukio[0]]);
});

test("loads round-specific datasets through their public paths", () => {
  const statistics = [
    {
      aloituspaikatLkm: 10,
      ensisijaisetHakijatLkm: 20,
      hakukohde: "Tietotekniikka",
      kaikkiHakijatLkm: 30,
      kooditHakukohde: "oid",
      valitutLkm: 8,
    },
  ];
  const programme = {
    nimi: { fi: "Insinööri" },
    sektori: "Ammattikorkeakoulu",
    toteutukset: [],
    tutkintotaso: "Alempi korkeakoulututkinto",
  };
  const needs = {
    items: [{ ala: "Tekniikka", koodi: "tek", sektori: "Yliopisto", tarve2045: 100, tuotosNuoret: 80 }],
  };
  const profile = [{ ikaryhmat: [], kohdeNimi: "Aalto", kohdeTyyppi: "koulu", sukupuoli: [] }];
  useDataFiles({
    "current_programs-2027-kevat-1.json": [programme],
    "current_programs-2027-kevat-2.json": [programme],
    "ennakointi/koulutustarpeet.json": needs,
    "hakijamäärät/hakijamaarat-2026-syksy.json": statistics,
    "hakijaprofiili/hakijaprofiili-2025-syksy.json": profile,
  });

  expect(readCurrentYearStatistics()).toEqual(statistics);
  expect(readAllPrograms()).toEqual([programme, programme]);
  expect(readKoulutustarpeet()).toEqual(needs);
  expect(readHakijaprofiili("2025_syksy")).toEqual(profile);
});
