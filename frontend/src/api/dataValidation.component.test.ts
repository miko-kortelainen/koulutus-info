import { expect, test } from "vitest";
import {
  parseCutoffSchools,
  parseCurrentPrograms,
  parseKoulutustarpeet,
  parseSchoolCatalog,
  parseStatistics,
  parseStudentFeedback,
} from "./dataValidation";

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

const studentFeedback = {
  Testiyliopisto: {
    tilastot: { vastaajatLkm: 100, keskiarvo: 3.75, keskihajonta: 1.1 },
    koulutusalat: {
      Kasvatusalat: {
        tilastot: { vastaajatLkm: 40, keskiarvo: 3.8, keskihajonta: 1 },
        osiot: {
          Oppiminen: {
            tasot: {
              I: {
                tilastot: { vastaajatLkm: 4, keskiarvo: 3.5, keskihajonta: 1 },
                kohteet: [
                  {
                    kohde: "Olen oppinut uutta.",
                    tilastot: { vastaajatLkm: null, keskiarvo: null, keskihajonta: null, salattu: true },
                  },
                ],
              },
            },
          },
        },
      },
    },
  },
};

test("accepts valid datasets", () => {
  expect(parseStatistics([statistics], "statistics.json")).toEqual([statistics]);
  expect(parseCurrentPrograms([school], "current_programs.json")).toEqual([school]);
  expect(parseSchoolCatalog([{ name: "Testikorkeakoulu", shortName: "Testi" }], "schools.json")).toEqual([
    { name: "Testikorkeakoulu", shortName: "Testi" },
  ]);
  expect(parseSchoolCatalog([{ name: "Helsingin yliopisto" }], "schools.json")).toEqual([
    { name: "Helsingin yliopisto" },
  ]);
  expect(parseCutoffSchools([cutoffSchool], "pisterajat.json")).toEqual([cutoffSchool]);
  expect(parseStudentFeedback(studentFeedback, "yliopisto-palaute.json", 5)).toEqual(studentFeedback);
});

test.each([-1, 1.5, Number.NaN])("rejects invalid statistics count %s", (valitutLkm) => {
  expect(() => parseStatistics([{ ...statistics, valitutLkm }], "statistics.json")).toThrow(
    "Invalid data in statistics.json",
  );
});

test("rejects malformed nested programme data", () => {
  const toteutus = { ...school.toteutukset[0], kunnat: [1] };

  expect(() => parseCurrentPrograms([{ ...school, toteutukset: [toteutus] }], "current_programs.json")).toThrow(
    "Invalid data in current_programs.json",
  );
});

test("rejects malformed school catalog entries", () => {
  expect(() => parseSchoolCatalog([{ shortName: "Testi" }], "schools.json")).toThrow("Invalid data in schools.json");
  expect(() => parseSchoolCatalog([{ name: "", shortName: "Testi" }], "schools.json")).toThrow(
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

test("rejects malformed nested student feedback", () => {
  const malformed = structuredClone(studentFeedback);
  Reflect.deleteProperty(malformed.Testiyliopisto.koulutusalat.Kasvatusalat.osiot.Oppiminen.tasot.I, "tilastot");

  expect(() => parseStudentFeedback(malformed, "yliopisto-palaute.json", 5)).toThrow(
    "Invalid data in yliopisto-palaute.json",
  );
});

test("validates feedback averages against the survey scale", () => {
  const field = studentFeedback.Testiyliopisto.koulutusalat.Kasvatusalat;
  const amkFeedback = {
    Testiamk: {
      ...studentFeedback.Testiyliopisto,
      koulutusalat: {
        Kasvatusalat: {
          ...field,
          osiot: {
            Opetus: {
              tilastot: { ...field.tilastot, keskiarvo: 4.5 },
              kohteet: [
                {
                  kohde: "Opetus oli asiantuntevaa.",
                  tilastot: { ...field.tilastot, keskiarvo: 5.4 },
                },
              ],
            },
          },
        },
      },
    },
  };

  expect(parseStudentFeedback(amkFeedback, "amk-palaute.json", 7)).toEqual(amkFeedback);
  expect(() => parseStudentFeedback(amkFeedback, "amk-palaute.json", 5)).toThrow("Invalid data in amk-palaute.json");
});

const koulutustarveItem = {
  sektori: "Ammattikorkeakoulu" as const,
  koodi: "amk-1",
  ala: "Sairaanhoitaja (AMK)",
  tarve2045: 4200,
  tuotosNuoret: 2800,
};

test("accepts valid koulutustarpeet", () => {
  expect(parseKoulutustarpeet({ items: [koulutustarveItem] }, "ennakointi/koulutustarpeet.json")).toEqual({
    items: [koulutustarveItem],
  });
});

test("rejects ammatillinen sektori in koulutustarpeet", () => {
  expect(() =>
    parseKoulutustarpeet(
      { items: [{ ...koulutustarveItem, sektori: "Ammatillinen koulutus" as "Ammattikorkeakoulu" }] },
      "ennakointi/koulutustarpeet.json",
    ),
  ).toThrow("Invalid data in ennakointi/koulutustarpeet.json");
});

test("rejects duplicate koulutustarve keys", () => {
  expect(() =>
    parseKoulutustarpeet({ items: [koulutustarveItem, { ...koulutustarveItem }] }, "ennakointi/koulutustarpeet.json"),
  ).toThrow("duplicate");
});
