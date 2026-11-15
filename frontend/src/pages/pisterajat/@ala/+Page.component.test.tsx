import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import AlaCutoffPage from "@/pages/pisterajat/@ala/+Page";
import type { AlaPageData } from "@/pages/pisterajat/@ala/+data";
import { renderWithChakra } from "@/test/render";

const pageData: AlaPageData = {
  alaName: "Lääketieteet",
  rounds: ["2026-kevat"],
  programmes: [
    {
      name: "Lääketiede",
      koulutusala: "Lääketieteet",
      schoolName: "Turun yliopisto",
      cutoffs: [
        {
          selectionMethod: "Todistusvalinta (YO)",
          score: 181.2,
          startYear: 2026,
          startSeason: "Syksy",
          round: "2026-kevat",
        },
      ],
    },
    {
      name: "Hammaslääketiede",
      koulutusala: "Lääketieteet",
      schoolName: "Oulun yliopisto",
      cutoffs: [
        {
          selectionMethod: "Todistusvalinta (YO)",
          score: 175.4,
          startYear: 2026,
          startSeason: "Syksy",
          round: "2026-kevat",
        },
      ],
    },
  ],
};

vi.mock("vike-react/useData", () => ({
  useData: () => pageData,
}));

test("filters programmes by name or school and shows empty state when nothing matches", async () => {
  const user = userEvent.setup();
  renderWithChakra(<AlaCutoffPage />);

  expect(screen.getByRole("heading", { level: 2, name: "Lääketiede" })).toBeVisible();
  expect(screen.getByRole("heading", { level: 2, name: "Hammaslääketiede" })).toBeVisible();

  const searchInput = screen.getByRole("textbox", { name: "Hae koulutusta tai korkeakoulua" });
  await user.type(searchInput, "Oulu");

  await waitFor(() => {
    expect(screen.queryByRole("heading", { level: 2, name: "Lääketiede" })).not.toBeInTheDocument();
  });
  expect(screen.getByRole("heading", { level: 2, name: "Hammaslääketiede" })).toBeVisible();

  await user.clear(searchInput);
  await user.type(searchInput, "ei-olemassa");

  await waitFor(() => {
    expect(screen.getByText("Ei tuloksia valituilla hakuehdoilla.")).toBeVisible();
  });
});
