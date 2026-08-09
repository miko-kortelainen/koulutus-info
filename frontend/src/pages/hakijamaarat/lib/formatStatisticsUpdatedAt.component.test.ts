import { expect, test } from "vitest";
import { formatStatisticsUpdatedAt } from "@/pages/hakijamaarat/lib/formatStatisticsUpdatedAt";

test("formats statisticsUpdatedAt as dd.mm.yyyy in Europe/Helsinki", () => {
  expect(formatStatisticsUpdatedAt("2026-08-08T14:38:02.955Z")).toBe("08.08.2026");
  // late UTC on the previous calendar day is still the next day in Helsinki
  expect(formatStatisticsUpdatedAt("2026-08-07T22:00:00.000Z")).toBe("08.08.2026");
});
