import { expect, test } from "vitest";
import { formatSchoolName } from "./serverData";

test("formats Swedish schools with catalog short names", () => {
  expect(formatSchoolName("Yrkeshögskolan Arcada")).toBe("Yrkeshögskolan Arcada (Arcada)");
  expect(formatSchoolName("Yrkeshögskolan Novia")).toBe("Yrkeshögskolan Novia (Novia)");
  expect(formatSchoolName("Åbo Akademi")).toBe("Åbo Akademi (ÅA)");
  expect(formatSchoolName("Svenska handelshögskolan")).toBe("Svenska handelshögskolan (Hanken)");
});

test("leaves Finnish universities without shorts unchanged", () => {
  expect(formatSchoolName("Helsingin yliopisto")).toBe("Helsingin yliopisto");
});

test("formats AMK short names from the catalog", () => {
  expect(formatSchoolName("Tampereen ammattikorkeakoulu")).toBe("Tampereen ammattikorkeakoulu (TAMK)");
});
