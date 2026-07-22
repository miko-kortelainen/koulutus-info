import { expect, test } from "vitest";
import { parseCutoffSchools, parseSchools, parseStatistics } from "./dataValidation";

const statistics = {
  kooditHakukohde: "1.2.246.562.20.00000000001",
  hakukohde: "Tietotekniikka",
  korkeakoulu: "Testikorkeakoulu",
  aloituspaikatLkm: 20,
  kaikkiHakijatLkm: 100,
  ensisijaisetHakijatLkm: 40,
  valitutLkm: 18,
};

const school = {
  nimi: { fi: "Testikorkeakoulu" },
  sektori: "Ammattikorkeakoulu",
  tutkintotaso: "Alempi korkeakoulututkinto",
  toteutukset: [
    {
      toteutusOid: "1.2.246.562.17.00000000001",
      toteutusNimi: { fi: "Tietotekniikka" },
      oppilaitosNimi: { fi: "Testikorkeakoulu" },
      kunnat: ["Helsinki"],
      koulutusalat: ["Tietojenkäsittely"],
      muuntokoulutus: false,
    },
  ],
};

const cutoffSchool = {
  name: "Testikorkeakoulu",
  sector: "Ammattikorkeakoulu",
  programmes: [
    {
      name: "Tietotekniikka",
      koulutusala: "Tietojenkäsittely",
      cutoffs: [{ selectionMethod: "Todistusvalinta (YO)", score: 82.5, startYear: 2026, startSeason: "Syksy" }],
    },
  ],
};

test("accepts valid datasets", () => {
  expect(parseStatistics([statistics], "statistics.json")).toEqual([statistics]);
  expect(parseSchools([school], "schools.json")).toEqual([school]);
  expect(parseCutoffSchools([cutoffSchool], "pisterajat.json")).toEqual([cutoffSchool]);
});

test.each([-1, 1.5, Number.NaN])("rejects invalid statistics count %s", (valitutLkm) => {
  expect(() => parseStatistics([{ ...statistics, valitutLkm }], "statistics.json")).toThrow(
    "Invalid data in statistics.json",
  );
});

test("rejects malformed nested school data", () => {
  const toteutus = { ...school.toteutukset[0], kunnat: [1] };

  expect(() => parseSchools([{ ...school, toteutukset: [toteutus] }], "schools.json")).toThrow(
    "Invalid data in schools.json",
  );
});

test("rejects malformed nested cutoff data", () => {
  const programme = cutoffSchool.programmes[0];
  const cutoff = { ...programme.cutoffs[0], score: Number.NaN };

  expect(() =>
    parseCutoffSchools([{ ...cutoffSchool, programmes: [{ ...programme, cutoffs: [cutoff] }] }], "pisterajat.json"),
  ).toThrow("Invalid data in pisterajat.json");
});
