import { renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import type { Programme } from "@/types/pisterajat.gen";
import type { SortOption } from "../components/SortControl";
import useFilteredProgrammes from "./useFilteredProgrammes";

const programmes: Programme[] = ["Zoologia", "Fysiikka", "Biologia"].map((name) => ({
  name,
  koulutusala: "Testiala",
  cutoffs: [],
}));

const names = (items: Programme[]) => items.map((item) => item.name);

test("trims search and sorts programmes without mutating the source", () => {
  const { result, rerender } = renderHook(
    ({ searchTerm, sortOrder }: { searchTerm: string; sortOrder: SortOption }) =>
      useFilteredProgrammes(programmes, searchTerm, sortOrder),
    { initialProps: { searchTerm: "  Fysiikka  ", sortOrder: "asc" } },
  );

  expect(names(result.current)).toEqual(["Fysiikka"]);

  rerender({ searchTerm: "", sortOrder: "asc" });
  expect(names(result.current)).toEqual(["Biologia", "Fysiikka", "Zoologia"]);

  rerender({ searchTerm: "", sortOrder: "desc" });
  expect(names(result.current)).toEqual(["Zoologia", "Fysiikka", "Biologia"]);
  expect(names(programmes)).toEqual(["Zoologia", "Fysiikka", "Biologia"]);
});
