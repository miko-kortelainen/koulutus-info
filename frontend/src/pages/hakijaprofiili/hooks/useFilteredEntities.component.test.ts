import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import type { HakijaprofiiliEntity } from "@/api/dataValidation";
import useFilteredEntities from "@/pages/hakijaprofiili/hooks/useFilteredEntities";

const entities: HakijaprofiiliEntity[] = [
  {
    kohdeTyyppi: "tutkinto",
    kohdeNimi: "Kaikki peitetty (AMK)",
    sukupuoli: [
      { nimi: "mies", lkm: null },
      { nimi: "nainen", lkm: 2 },
    ],
    ikaryhmat: [
      { nimi: "19", lkm: null },
      { nimi: "20", lkm: 4 },
    ],
  },
  {
    kohdeTyyppi: "tutkinto",
    kohdeNimi: "Julkaistu sukupuoli (AMK)",
    sukupuoli: [
      { nimi: "mies", lkm: null },
      { nimi: "nainen", lkm: 120 },
    ],
    ikaryhmat: [
      { nimi: "19", lkm: 3 },
      { nimi: "20", lkm: null },
    ],
  },
  {
    kohdeTyyppi: "tutkinto",
    kohdeNimi: "Julkaistu ikä (AMK)",
    sukupuoli: [
      { nimi: "mies", lkm: 1 },
      { nimi: "nainen", lkm: null },
    ],
    ikaryhmat: [
      { nimi: "19", lkm: 60 },
      { nimi: "20", lkm: null },
    ],
  },
  {
    kohdeTyyppi: "koulu",
    kohdeNimi: "Peitetty koulu",
    sukupuoli: [
      { nimi: "mies", lkm: null },
      { nimi: "nainen", lkm: 2 },
    ],
    ikaryhmat: [
      { nimi: "19", lkm: null },
      { nimi: "20", lkm: 4 },
    ],
  },
];

const names = (items: HakijaprofiiliEntity[]) => items.map((item) => item.kohdeNimi);

test("omits tutkinto when sukupuoli and ikäryhmät are all under five or null", () => {
  const { result } = renderHook(() => useFilteredEntities(entities, "tutkinto", "", "asc"));
  expect(names(result.current)).toEqual(["Julkaistu ikä (AMK)", "Julkaistu sukupuoli (AMK)"]);
});

test("keeps fully masked koulu entities on the koulu tab", () => {
  const { result } = renderHook(() => useFilteredEntities(entities, "koulu", "", "asc"));
  expect(names(result.current)).toEqual(["Peitetty koulu"]);
});

test("searches only among tutkinto that still have publishable rows", () => {
  const { result } = renderHook(() => useFilteredEntities(entities, "tutkinto", "peitetty", "asc"));
  expect(names(result.current)).toEqual([]);
});
