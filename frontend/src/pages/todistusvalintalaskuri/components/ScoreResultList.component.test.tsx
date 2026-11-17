import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { expect, test } from "vitest";
import ScoreResultList from "@/pages/todistusvalintalaskuri/components/ScoreResultList";
import type { ScoreResult } from "@/pages/todistusvalintalaskuri/lib/scoreResults";
import { renderWithChakra } from "@/test/render";

const makeResults = (count: number, prefix = "Ohjelma"): ScoreResult[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    koulutusala: "Tekniikan alat",
    programmeName: `${prefix} ${index + 1}`,
    schoolName: "Testi-yliopisto",
    score: 100 + index,
    sector: "Yliopistokoulutus",
    selectionMethod: "Todistusvalinta",
  }));

test("resets visible count to initial batch when results change", async () => {
  const user = userEvent.setup();
  const initial = makeResults(25, "Alku");
  const updated = makeResults(25, "Uusi");

  function Harness() {
    const [results, setResults] = useState(initial);
    return (
      <>
        <button onClick={() => setResults(updated)} type="button">
          Vaihda tulokset
        </button>
        <ScoreResultList results={results} roundLabel="kevät 2026" />
      </>
    );
  }

  renderWithChakra(<Harness />);

  expect(screen.getByText("Näytetään 20 / 25")).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Näytä lisää" }));
  expect(screen.getByText("Näytetään 25 / 25")).toBeVisible();

  await user.click(screen.getByRole("button", { name: "Vaihda tulokset" }));
  expect(screen.getByText("Näytetään 20 / 25")).toBeVisible();
  expect(screen.getByText("Uusi 1")).toBeVisible();
});
