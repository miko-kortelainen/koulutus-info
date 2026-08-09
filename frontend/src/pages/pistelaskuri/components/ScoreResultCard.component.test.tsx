import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { ScoreResult } from "@/pages/pistelaskuri/lib/scoreResults";
import ScoreResultCard from "@/pages/pistelaskuri/components/ScoreResultCard";

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

test("score breakdown disclosure lists assigned and unused subjects", async () => {
  const user = userEvent.setup();
  renderWithChakra(
    <ScoreResultCard
      result={result({
        applicantScore: 166,
        scoreBreakdown: {
          rows: [
            { exam: "ai_fi", grade: "L", label: "Suomi äidinkielenä", points: 46 },
            { exam: "te", grade: "B", label: "Terveystieto", points: null },
            { exam: "maa", grade: "E", label: "Matematiikka, pitkä", points: 36 },
          ],
        },
      })}
      roundLabel="kevät 2026"
    />,
  );

  await user.click(screen.getByRole("button", { name: "Miten pisteeni laskettiin?" }));
  const table = screen.getByRole("table", { name: "Pisteytyksen erittely aineittain" });
  expect(table).toBeVisible();
  expect(screen.getByRole("columnheader", { name: "Aine" })).toBeVisible();
  const aineCells = screen
    .getAllByRole("row")
    .slice(1, -1)
    .map((row) => row.querySelector("td")?.textContent);
  expect(aineCells).toEqual(["Suomi äidinkielenä", "Terveystieto", "Matematiikka, pitkä"]);
  expect(screen.getByRole("cell", { name: "46" })).toBeVisible();
  expect(screen.getByRole("cell", { name: "–" })).toBeVisible();
  expect(screen.getByRole("cell", { name: "166" })).toBeVisible();
});

test("score breakdown disclosure is hidden without breakdown data", () => {
  renderWithChakra(<ScoreResultCard result={result({ applicantScore: 120 })} roundLabel="kevät 2026" />);

  expect(screen.queryByRole("button", { name: "Miten pisteeni laskettiin?" })).not.toBeInTheDocument();
});
