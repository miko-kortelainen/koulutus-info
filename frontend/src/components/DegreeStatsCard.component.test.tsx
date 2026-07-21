import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { StatisticsEntry } from "@/types.gen";
import DegreeStatsCard from "./DegreeStatsCard";

const entry = (overrides: Partial<StatisticsEntry>): StatisticsEntry => ({
  kooditHakukohde: "test",
  hakukohde: "Testikohde",
  korkeakoulu: "Testikorkeakoulu",
  aloituspaikatLkm: 20,
  kaikkiHakijatLkm: 281,
  ensisijaisetHakijatLkm: 50,
  valitutLkm: 43,
  ...overrides,
});

test("shows the admission percentage and masks it when a source count is under five", () => {
  renderWithChakra(
    <ul>
      <DegreeStatsCard degree={entry({})} />
      <DegreeStatsCard degree={entry({ kooditHakukohde: "masked", valitutLkm: 4 })} />
    </ul>,
  );

  expect(screen.getAllByText("Sisäänpääsyprosentti")).toHaveLength(2);
  expect(screen.getByText("15,3 %")).toBeInTheDocument();
  expect(screen.getByText("–")).toBeInTheDocument();
});
