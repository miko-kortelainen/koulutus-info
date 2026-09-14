import { expect, test } from "vitest";
import { programmeRoundIntro, programmeRoundLabel } from "@/config/programmeRounds";

test("labels kevät waves and syksy rounds in Finnish", () => {
  expect(programmeRoundLabel("2027_kevat_1")).toBe("Kevään 1. yhteishaku 2027");
  expect(programmeRoundLabel("2027_kevat_2")).toBe("Kevään 2. yhteishaku 2027");
});

test("describes the selected wave in the inessive", () => {
  expect(programmeRoundIntro("2027_kevat_1")).toBe(
    "Korkeakoulujen kevään 2027 ensimmäisessä yhteishaussa olevat toteutukset.",
  );
  expect(programmeRoundIntro("2027_kevat_2")).toBe(
    "Korkeakoulujen kevään 2027 toisessa yhteishaussa olevat toteutukset.",
  );
});
