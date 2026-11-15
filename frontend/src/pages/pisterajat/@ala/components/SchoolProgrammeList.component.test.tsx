import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { AlaProgramme } from "@/pages/pisterajat/@ala/+data";
import SchoolProgrammeList from "@/pages/pisterajat/@ala/components/SchoolProgrammeList";
import { renderWithChakra } from "@/test/render";

const programmes: AlaProgramme[] = Array.from({ length: 45 }, (_, index) => ({
  name: `Koulutus ${index + 1}`,
  koulutusala: "Terveys- ja hyvinvointialat",
  schoolName: "Turun yliopisto",
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

test("paginates programmes in pages of 20 without Näytä lisää button", async () => {
  vi.stubGlobal("scrollTo", vi.fn());
  const user = userEvent.setup();
  renderWithChakra(<SchoolProgrammeList headingLevel="h3" programmes={programmes} />);

  expect(screen.queryByRole("button", { name: "Näytä lisää" })).not.toBeInTheDocument();
  expect(screen.getByRole("navigation", { name: "Sivutus" })).toBeInTheDocument();
  expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(20);
  expect(screen.getByRole("heading", { name: "Koulutus 1" })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "Koulutus 21" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Seuraava sivu" }));
  expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(20);
  expect(screen.queryByRole("heading", { name: "Koulutus 1" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Koulutus 21" })).toBeVisible();
  expect(screen.queryByRole("heading", { name: "Koulutus 41" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Sivu 3/3" }));
  expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(5);
  expect(screen.getByRole("heading", { name: "Koulutus 41" })).toBeVisible();
  expect(screen.getByRole("heading", { name: "Koulutus 45" })).toBeVisible();
});

test("omits pagination when all programmes fit on a single page", () => {
  renderWithChakra(<SchoolProgrammeList headingLevel="h3" programmes={programmes.slice(0, 20)} />);

  expect(within(screen.getByRole("list")).getAllByRole("listitem")).toHaveLength(20);
  expect(screen.queryByRole("navigation", { name: "Sivutus" })).not.toBeInTheDocument();
});
