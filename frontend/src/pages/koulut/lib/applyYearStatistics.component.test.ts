import { expect, test } from "vitest";
import type { SchoolListItem } from "@/pages/koulut/+data";
import { applyYearStatistics, schoolStatisticTotals } from "@/pages/koulut/lib/applyYearStatistics";
import type { StatisticsEntry } from "@/types.gen";

const school = (overrides: Partial<SchoolListItem>): SchoolListItem => ({
  name: "Testikorkeakoulu",
  slug: "testikorkeakoulu",
  sektori: "Yliopistokoulutus",
  kaikkiHakijat: 10,
  valitut: 2,
  ensisijaisetHakijat: 3,
  aloituspaikat: 5,
  feedbackAverage: 4.1,
  feedbackMaxScore: 5,
  ...overrides,
});

const entry = (overrides: Partial<StatisticsEntry>): StatisticsEntry => ({
  kooditHakukohde: "a",
  hakukohde: "Kohde A",
  korkeakoulu: "Testikorkeakoulu",
  aloituspaikatLkm: 10,
  kaikkiHakijatLkm: 40,
  ensisijaisetHakijatLkm: 12,
  valitutLkm: 8,
  ...overrides,
});

test("sums matching rows and leaves schools missing from the yhteishaku without counts", () => {
  const schools = [
    school({}),
    school({ name: "Toinen koulu", slug: "toinen-koulu", kaikkiHakijat: 99, valitut: 9, ensisijaisetHakijat: 8 }),
  ];

  const next = applyYearStatistics(schools, [
    entry({}),
    entry({
      kooditHakukohde: "b",
      hakukohde: "Kohde B",
      aloituspaikatLkm: 5,
      kaikkiHakijatLkm: 20,
      ensisijaisetHakijatLkm: 6,
      valitutLkm: 4,
    }),
    entry({ kooditHakukohde: "c", korkeakoulu: "Kolmas koulu", kaikkiHakijatLkm: 500 }),
  ]);

  expect(next).toEqual([
    school({ kaikkiHakijat: 60, valitut: 12, ensisijaisetHakijat: 18, aloituspaikat: 15 }),
    school({
      name: "Toinen koulu",
      slug: "toinen-koulu",
      kaikkiHakijat: null,
      valitut: null,
      ensisijaisetHakijat: null,
      aloituspaikat: null,
    }),
  ]);
  expect(schools[0].kaikkiHakijat).toBe(10);
});

test("keeps masked totals when a school has rows under 5", () => {
  expect(
    schoolStatisticTotals([
      entry({
        kaikkiHakijatLkm: 3,
        valitutLkm: 1,
        ensisijaisetHakijatLkm: 2,
        aloituspaikatLkm: 4,
      }),
    ]),
  ).toEqual({
    kaikkiHakijat: 3,
    valitut: 1,
    ensisijaisetHakijat: 2,
    aloituspaikat: 4,
  });
});

test("returns null totals when a school has no rows in the yhteishaku", () => {
  expect(schoolStatisticTotals([])).toEqual({
    kaikkiHakijat: null,
    valitut: null,
    ensisijaisetHakijat: null,
    aloituspaikat: null,
  });
});

test("aggregates a school's rows", () => {
  expect(
    schoolStatisticTotals([
      entry({}),
      entry({
        kooditHakukohde: "b",
        kaikkiHakijatLkm: 5,
        valitutLkm: 1,
        ensisijaisetHakijatLkm: 2,
        aloituspaikatLkm: 3,
      }),
    ]),
  ).toEqual({
    kaikkiHakijat: 45,
    valitut: 9,
    ensisijaisetHakijat: 14,
    aloituspaikat: 13,
  });
});
