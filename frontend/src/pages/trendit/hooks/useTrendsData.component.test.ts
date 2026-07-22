import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import type { StatisticsEntry } from "@/types.gen";
import useTrendsData from "./useTrendsData";

const groups: [string | undefined, string | undefined, string | undefined, number][] = [
  ["Tekniikka", "Aalto-yliopisto", "Yliopistokoulutus", 30],
  ["Terveys", "Metropolia", "Ammattikorkeakoulukoulutus", 40],
  ["Tekniikka", "Aalto-yliopisto", "Yliopistokoulutus", 20],
  ["Kauppa", "Tampereen ammattikorkeakoulu", "Ammattikorkeakoulukoulutus", 15],
  [undefined, undefined, undefined, 100],
];

const statistics: StatisticsEntry[] = groups.map(([field, school, sector, applicants], index) => ({
  kooditHakukohde: String(index),
  hakukohde: `Hakukohde ${index}`,
  koulutusalaTaso1: field,
  korkeakoulu: school,
  sektori: sector,
  aloituspaikatLkm: 1,
  kaikkiHakijatLkm: applicants,
  ensisijaisetHakijatLkm: applicants,
  valitutLkm: applicants,
}));

test("aggregates, sorts, and limits trend data", () => {
  const { result } = renderHook(() => useTrendsData(statistics, 2));

  expect(result.current.topKoulutusalat).toEqual([
    { name: "Tekniikka", value: 50 },
    { name: "Terveys", value: 40 },
  ]);
  expect(result.current.topKorkeakoulut).toEqual([
    { name: "Aalto-yliopisto", value: 50 },
    { name: "Metropolia", value: 40 },
  ]);
  expect(result.current.sektoriData).toEqual([
    { name: "Ammattikorkeakoulukoulutus", value: 55 },
    { name: "Yliopistokoulutus", value: 50 },
  ]);
});
