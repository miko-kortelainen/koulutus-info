import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { StatisticsEntry } from "@/types.gen";
import ComparisonTable from "./ComparisonTable";

const entry = (overrides: Partial<StatisticsEntry>): StatisticsEntry => ({
  kooditHakukohde: "test",
  hakukohde: "Testikohde",
  aloituspaikatLkm: 10,
  kaikkiHakijatLkm: 100,
  ensisijaisetHakijatLkm: 20,
  ...overrides,
});

test("masks small counts and omits trends for masked, equal, and unavailable values", () => {
  renderWithChakra(
    <ComparisonTable
      a={entry({
        kooditHakukohde: "a",
        hakukohde: "Kohde A",
        korkeakoulu: undefined,
        aloituspaikatLkm: 0,
        kaikkiHakijatLkm: 4,
        ensisijaisetHakijatLkm: 10,
      })}
      b={entry({
        kooditHakukohde: "b",
        hakukohde: "Kohde B",
        korkeakoulu: "Koulu B",
        aloituspaikatLkm: 0,
        kaikkiHakijatLkm: 10,
        ensisijaisetHakijatLkm: 10,
      })}
    />,
  );

  expect(screen.getAllByText("alle 5")).toHaveLength(3);
  expect(screen.getAllByText("n/a")).toHaveLength(2);
  expect(screen.getByText("-")).toBeInTheDocument();
  expect(screen.queryByRole("img", { name: "Suurempi arvo" })).not.toBeInTheDocument();
  expect(screen.queryByRole("img", { name: "Pienempi arvo" })).not.toBeInTheDocument();
});

test("renders accessible trends, pressure values, and pressure tiers", () => {
  renderWithChakra(
    <ComparisonTable
      a={entry({
        kooditHakukohde: "a",
        hakukohde: "Kohde A",
        aloituspaikatLkm: 10,
        kaikkiHakijatLkm: 100,
        ensisijaisetHakijatLkm: 30,
      })}
      b={entry({
        kooditHakukohde: "b",
        hakukohde: "Kohde B",
        aloituspaikatLkm: 20,
        kaikkiHakijatLkm: 80,
        ensisijaisetHakijatLkm: 10,
      })}
    />,
  );

  expect(screen.getAllByRole("img", { name: "Suurempi arvo" })).toHaveLength(4);
  expect(screen.getAllByRole("img", { name: "Pienempi arvo" })).toHaveLength(4);
  expect(screen.getByText("3.00")).toBeInTheDocument();
  expect(screen.getByText("0.50")).toBeInTheDocument();
  expect(screen.getByText("Korkea")).toBeInTheDocument();
  expect(screen.getByText("Matala")).toBeInTheDocument();
});
