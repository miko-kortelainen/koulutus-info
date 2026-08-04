import { expect, test } from "vitest";
import { filterAndSortVajeRows, statusLabel } from "./vaje";

const items = [
  {
    sektori: "Ammattikorkeakoulu" as const,
    koodi: "a",
    ala: "Sairaanhoitaja (AMK)",
    tarve2045: 4200,
    tuotosNuoret: 2800,
  },
  {
    sektori: "Yliopisto" as const,
    koodi: "b",
    ala: "Oikeustieteen maisteri",
    tarve2045: 800,
    tuotosNuoret: 950,
  },
  {
    sektori: "Ammattikorkeakoulu" as const,
    koodi: "c",
    ala: "Sosionomi (AMK)",
    tarve2045: 2100,
    tuotosNuoret: 1650,
  },
];

test("statusLabel marks pula, ylituotos, and tasapaino", () => {
  expect(statusLabel(100)).toBe("Pula");
  expect(statusLabel(-50)).toBe("Ylituotos");
  expect(statusLabel(0)).toBe("Tasapaino");
});

test("filterAndSortVajeRows sorts largest vaje first", () => {
  const rows = filterAndSortVajeRows(items, "", "kaikki", "isoin-vaje");
  expect(rows.map((r) => r.koodi)).toEqual(["a", "c", "b"]);
  expect(rows[0]?.vaje).toBe(1400);
  expect(rows[2]?.vaje).toBe(-150);
});

test("filterAndSortVajeRows sorts by pienin vaje and name", () => {
  expect(filterAndSortVajeRows(items, "", "kaikki", "pienin-vaje").map((r) => r.koodi)).toEqual(["b", "c", "a"]);
  expect(filterAndSortVajeRows(items, "", "kaikki", "a-o").map((r) => r.ala)).toEqual([
    "Oikeustieteen maisteri",
    "Sairaanhoitaja (AMK)",
    "Sosionomi (AMK)",
  ]);
  expect(filterAndSortVajeRows(items, "", "kaikki", "o-a").map((r) => r.ala)).toEqual([
    "Sosionomi (AMK)",
    "Sairaanhoitaja (AMK)",
    "Oikeustieteen maisteri",
  ]);
});

test("filterAndSortVajeRows filters by sektori and search", () => {
  expect(filterAndSortVajeRows(items, "", "Yliopisto", "isoin-vaje")).toHaveLength(1);
  expect(filterAndSortVajeRows(items, "sairaan", "kaikki", "isoin-vaje")[0]?.ala).toBe("Sairaanhoitaja (AMK)");
  expect(filterAndSortVajeRows(items, "ei-loydy", "kaikki", "isoin-vaje")).toEqual([]);
});
