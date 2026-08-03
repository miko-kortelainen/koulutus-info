import { expect, test } from "vitest";
import { schoolNameWithShort } from "./schoolShortNames";

test("appends short name for a mapped AMK", () => {
  expect(schoolNameWithShort("Tampereen ammattikorkeakoulu")).toBe("Tampereen ammattikorkeakoulu (TAMK)");
});

test("returns the full name unchanged when unmapped", () => {
  expect(schoolNameWithShort("Helsingin yliopisto")).toBe("Helsingin yliopisto");
  expect(schoolNameWithShort("tampereen ammattikorkeakoulu")).toBe("tampereen ammattikorkeakoulu");
});
