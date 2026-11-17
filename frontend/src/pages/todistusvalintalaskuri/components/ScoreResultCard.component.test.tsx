import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import ScoreResultCard from "@/pages/todistusvalintalaskuri/components/ScoreResultCard";
import type { ScoreResult } from "@/pages/todistusvalintalaskuri/lib/scoreResults";
import { renderWithChakra } from "@/test/render";

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

test("before calculation shows cutoff without applicant score or status badge", () => {
  renderWithChakra(<ScoreResultCard result={result({})} roundLabel="kevät 2026" />);

  expect(screen.getByText("Pisteraja (kevät 2026)")).toBeVisible();
  expect(screen.getByText("100")).toBeVisible();
  expect(screen.queryByText("Pisteesi")).not.toBeInTheDocument();
  expect(screen.queryByText(/Pisteet (riittävät|eivät riitä)/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Kynnysehto/)).not.toBeInTheDocument();
});

test("university program without a threshold shows no kynnysehto note after calculation", () => {
  renderWithChakra(<ScoreResultCard result={result({ applicantScore: 120 })} roundLabel="kevät 2026" />);

  expect(screen.getByText("Pisteet riittävät")).toBeVisible();
  expect(screen.getByText("Pisteesi")).toBeVisible();
  expect(screen.getByText("120")).toBeVisible();
  expect(screen.getByText("Pisteraja (kevät 2026)")).toBeVisible();
  expect(screen.getByText("100")).toBeVisible();
  expect(screen.queryByText(/Kynnysehto/)).not.toBeInTheDocument();
});

test("program below cutoff shows Pisteesi eivät riitä even if kynnysehto passes", () => {
  renderWithChakra(
    <ScoreResultCard
      result={result({
        applicantScore: 80,
        kynnysehtoLabel: "Hyväksytty englannin koe.",
        kynnysehtoPassed: true,
      })}
      roundLabel="kevät 2026"
    />,
  );

  expect(screen.getByText("Pisteesi eivät riitä")).toBeVisible();
  expect(screen.queryByText("Pisteet riittävät")).not.toBeInTheDocument();
  expect(screen.getByText("Hyväksytty englannin koe.")).toBeVisible();
  expect(screen.queryByText(/Kynnysehto täyttyy/)).not.toBeInTheDocument();
});

test("university program with a failed threshold and enough points shows Kynnysehto ei täyty", () => {
  renderWithChakra(
    <ScoreResultCard
      result={result({
        applicantScore: 120,
        kynnysehtoLabel: "Hyväksytty englannin koe.",
        kynnysehtoPassed: false,
      })}
      roundLabel="kevät 2026"
    />,
  );

  expect(screen.getByText("Kynnysehto ei täyty", { selector: ".chakra-badge" })).toBeVisible();
  expect(screen.getByText("Hyväksytty englannin koe.")).toBeVisible();
  expect(screen.queryByText(/Kynnysehto ei täyty:/)).not.toBeInTheDocument();
});

test("before calculation shows kynnysehto label when threshold exists", () => {
  renderWithChakra(
    <ScoreResultCard result={result({ kynnysehtoLabel: "Hyväksytty englannin koe." })} roundLabel="kevät 2026" />,
  );

  expect(screen.getByText(/Kynnysehto:/)).toBeVisible();
  expect(screen.getByText(/Hyväksytty englannin koe\./)).toBeVisible();
});

test("program meeting both cutoff and threshold shows Pisteet riittävät and threshold label", () => {
  renderWithChakra(
    <ScoreResultCard
      result={result({
        applicantScore: 120,
        kynnysehtoLabel: "Hyväksytty englannin koe.",
        kynnysehtoPassed: true,
      })}
      roundLabel="kevät 2026"
    />,
  );

  expect(screen.getByText("Pisteet riittävät")).toBeVisible();
  expect(screen.getByText("Hyväksytty englannin koe.")).toBeVisible();
  expect(screen.queryByText(/Kynnysehto täyttyy/)).not.toBeInTheDocument();
});

test("omits koulutusala metadata when showKoulutusala is false", () => {
  renderWithChakra(<ScoreResultCard result={result({})} roundLabel="kevät 2026" />);
  expect(screen.queryByText("Tekniikan alat")).not.toBeInTheDocument();
});

test("shows koulutusala metadata when showKoulutusala is true", () => {
  renderWithChakra(<ScoreResultCard result={result({})} roundLabel="kevät 2026" showKoulutusala />);
  expect(screen.getByText("Tekniikan alat")).toBeVisible();
});

test("AMK program without a threshold shows no kynnysehto line", () => {
  renderWithChakra(
    <ScoreResultCard result={result({ sector: "Ammattikorkeakoulukoulutus" })} roundLabel="kevät 2026" />,
  );

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
