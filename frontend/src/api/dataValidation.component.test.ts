import { expect, test } from "vitest";
import { parseCutoffSchools, parseSchools, parseStatistics } from "./dataValidation";

test("rejects malformed statistics", () => {
  expect(() => parseStatistics([{}], "statistics.json")).toThrow("Invalid data in statistics.json");
});

test("rejects malformed schools", () => {
  expect(() => parseSchools([{ toteutukset: "invalid" }], "schools.json")).toThrow("Invalid data in schools.json");
});

test("rejects malformed cutoffs", () => {
  expect(() => parseCutoffSchools([{ programmes: [{}] }], "pisterajat.json")).toThrow(
    "Invalid data in pisterajat.json",
  );
});
