import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { ProgrammeWithRounds } from "@/api/cutoffs";
import { renderWithChakra } from "@/test/render";
import CutoffCard from "./CutoffCard";

const programme: ProgrammeWithRounds = {
  name: "Kätilö (AMK), päivätoteutus",
  koulutusala: "Terveys- ja hyvinvointialat",
  cutoffs: [
    { selectionMethod: "Todistusvalinta (YO)", score: 69, startYear: 2026, startSeason: "Syksy", round: "2026-kevat" },
    { selectionMethod: "Todistusvalinta (YO)", score: 84.5, startYear: 2026, startSeason: "Kevät", round: "2025-syksy" },
  ],
};

test("labels each cutoff with its hakukierros when showRound is set", () => {
  renderWithChakra(<CutoffCard programme={programme} showRound />);

  expect(screen.getByText("kevät 2026")).toBeInTheDocument();
  expect(screen.getByText("syksy 2025")).toBeInTheDocument();
});

test("omits round labels by default", () => {
  renderWithChakra(<CutoffCard programme={programme} />);

  expect(screen.queryByText("kevät 2026")).not.toBeInTheDocument();
});

test("renders the programme name at the requested heading level", () => {
  renderWithChakra(<CutoffCard headingLevel="h3" programme={programme} />);

  expect(screen.getByRole("heading", { level: 3, name: "Kätilö (AMK), päivätoteutus" })).toBeInTheDocument();
});

test("formats scores with Finnish decimals and no forced trailing zeros", () => {
  renderWithChakra(<CutoffCard programme={programme} />);

  expect(screen.getByText("69")).toBeInTheDocument();
  expect(screen.getByText("84,5")).toBeInTheDocument();
});
