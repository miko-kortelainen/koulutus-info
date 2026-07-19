import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import ScoreResultCard from "./ScoreResultCard";

const result = {
  id: "test",
  programmeName: "Testikoulutus",
  schoolName: "Testikorkeakoulu",
  koulutusala: "Testiala",
  score: 100,
  sector: "Ammattikorkeakoulukoulutus",
  selectionMethod: "Todistusvalinta (YO)",
};

test("states qualification without relying on color", () => {
  renderWithChakra(
    <>
      <ScoreResultCard result={result} roundLabel="kevät 2026" userScore={101} />
      <ScoreResultCard result={{ ...result, id: "other" }} roundLabel="kevät 2026" userScore={99} />
    </>,
  );

  expect(screen.getByText("Pisteet riittävät")).toBeInTheDocument();
  expect(screen.getByText("Pisteet eivät riitä")).toBeInTheDocument();
});
