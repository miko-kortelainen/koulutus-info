import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import type { StatisticsEntry } from "@/types.gen";
import useTrendsData from "./useTrendsData";

const fields: [string | undefined, number][] = [
  ["Tekniikka", 30],
  ["Terveys", 40],
  ["Tekniikka", 20],
  ["Kauppa", 10],
  [undefined, 100],
];

const statistics: StatisticsEntry[] = fields.map(([field, applicants], index) => ({
  kooditHakukohde: String(index),
  hakukohde: `Hakukohde ${index}`,
  koulutusalaTaso1: field,
  aloituspaikatLkm: 1,
  kaikkiHakijatLkm: applicants,
  ensisijaisetHakijatLkm: applicants,
}));

test("aggregates, sorts, and limits trend data", () => {
  const { result } = renderHook(() => useTrendsData(statistics, 2));

  expect(result.current.topKoulutusalat).toEqual([
    { name: "Tekniikka", value: 50 },
    { name: "Terveys", value: 40 },
  ]);
});
