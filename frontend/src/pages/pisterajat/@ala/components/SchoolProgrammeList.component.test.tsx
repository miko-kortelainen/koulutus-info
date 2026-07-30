import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import type { ProgrammeWithRounds } from "@/lib/cutoffs";
import { renderWithChakra } from "@/test/render";
import SchoolProgrammeList from "./SchoolProgrammeList";

const programmes: ProgrammeWithRounds[] = Array.from({ length: 45 }, (_, index) => ({
  name: `Koulutus ${index + 1}`,
  koulutusala: "Terveys- ja hyvinvointialat",
  cutoffs: [
    {
      selectionMethod: "Todistusvalinta (YO)",
      score: 70 + index,
      startYear: 2026,
      startSeason: "Syksy",
      round: "2026-kevat",
    },
  ],
}));

test("renders the first batch and reveals more in increments of 20", async () => {
  const user = userEvent.setup();
  renderWithChakra(<SchoolProgrammeList headingLevel="h3" programmes={programmes} />);

  expect(screen.getByText("Näytetään 20 / 45")).toBeVisible();
  const moreButton = screen.getByRole("button", { name: "Näytä lisää" });
  expect(moreButton).toBeVisible();

  await user.click(moreButton);
  expect(screen.getByText("Näytetään 40 / 45")).toBeVisible();
  expect(screen.getByRole("button", { name: "Näytä lisää" })).toBeVisible();

  await user.click(screen.getByRole("button", { name: "Näytä lisää" }));
  expect(screen.getByText("Näytetään 45 / 45")).toBeVisible();
  expect(screen.queryByRole("button", { name: "Näytä lisää" })).not.toBeInTheDocument();
});