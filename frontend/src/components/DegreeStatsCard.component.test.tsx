import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
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

test("shows the degree statistics, school link, and application pressure", () => {
  renderWithChakra(
    <ul>
      <DegreeStatsCard degree={entry({})} />
    </ul>,
  );

  expect(screen.getByRole("link", { name: "Testikorkeakoulu" })).toHaveAttribute("href", "/koulut/testikorkeakoulu/");
  expect(screen.getByRole("listitem")).toHaveTextContent(
    /Kaikki hakijat\s*281\s*Ensisijaiset hakijat\s*50\s*Aloituspaikat\s*20/,
  );
  expect(screen.getByText("Korkea hakijapaine")).toBeInTheDocument();
});

test("allows removing a selected degree while disabling a new selection when the comparison is full", async () => {
  const user = userEvent.setup();
  const onToggleCompare = vi.fn();

  renderWithChakra(
    <ul>
      <DegreeStatsCard degree={entry({})} isSelected onToggleCompare={onToggleCompare} selectionFull />
      <DegreeStatsCard
        degree={entry({ hakukohde: "Toinen testikohde", kooditHakukohde: "full" })}
        onToggleCompare={onToggleCompare}
        selectionFull
      />
    </ul>,
  );

  const selectedButton = screen.getByRole("button", { name: "Valittu ✓" });
  expect(selectedButton).toBeEnabled();
  expect(screen.getByRole("button", { name: "Vertaile" })).toBeDisabled();

  await user.click(selectedButton);

  expect(onToggleCompare).toHaveBeenCalledOnce();
  expect(onToggleCompare).toHaveBeenCalledWith(entry({}));
});
