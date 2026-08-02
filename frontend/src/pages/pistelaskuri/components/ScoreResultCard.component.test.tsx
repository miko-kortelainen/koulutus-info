import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { ScoreResult } from "../lib/scoreResults";
import ScoreResultCard from "./ScoreResultCard";

const result = (overrides: Partial<ScoreResult>): ScoreResult => ({
  id: "k1",
  koulutusala: "Tekniikan alat",
  programmeName: "Koneinsinöörit",
  schoolName: "Testi-yliopisto",
  score: 100,
  sector: "Yliopistokoulutus",
  selectionMethod: "Todistusvalinta",
  ...overrides,
});

test("university program without a threshold hides Ei kynnysehtoa until calculated", () => {
  renderWithChakra(<ScoreResultCard result={result({})} roundLabel="kevät 2026" />);

  expect(screen.queryByText("Ei kynnysehtoa.")).not.toBeInTheDocument();
});

test("university program without a threshold shows Ei kynnysehtoa after calculation", () => {
  renderWithChakra(<ScoreResultCard result={result({ applicantScore: 120 })} roundLabel="kevät 2026" />);

  expect(screen.getByText("Ei kynnysehtoa.")).toBeVisible();
  expect(screen.queryByText("Kynnysehto täyttyy.")).not.toBeInTheDocument();
  expect(screen.queryByText("Kynnysehto ei täyty.")).not.toBeInTheDocument();
});

test("university program with a passed threshold shows the label and täyttyy", () => {
  renderWithChakra(
    <ScoreResultCard
      result={result({ kynnysehtoLabel: "Hyväksytty englannin koe.", kynnysehtoPassed: true })}
      roundLabel="kevät 2026"
    />,
  );

  expect(screen.getByText("Hyväksytty englannin koe.")).toBeVisible();
  expect(screen.getByText("Kynnysehto täyttyy.")).toBeVisible();
  expect(screen.queryByText("Ei kynnysehtoa.")).not.toBeInTheDocument();
});

test("university program with a failed threshold shows status before the label", () => {
  renderWithChakra(
    <ScoreResultCard
      result={result({ kynnysehtoLabel: "Hyväksytty englannin koe.", kynnysehtoPassed: false })}
      roundLabel="kevät 2026"
    />,
  );

  const status = screen.getByText("Kynnysehto ei täyty.");
  const label = screen.getByText("Hyväksytty englannin koe.");
  expect(status.compareDocumentPosition(label) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.queryByText("Ei kynnysehtoa.")).not.toBeInTheDocument();
});

test("AMK program without a threshold shows no kynnysehto line", () => {
  renderWithChakra(
    <ScoreResultCard result={result({ sector: "Ammattikorkeakoulukoulutus" })} roundLabel="kevät 2026" />,
  );

  expect(screen.queryByText("Ei kynnysehtoa.")).not.toBeInTheDocument();
  expect(screen.queryByText(/Kynnysehto/)).not.toBeInTheDocument();
});
