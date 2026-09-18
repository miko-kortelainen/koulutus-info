import { expect, test } from "vitest";
import { formatCount, formatSisaanpaasyprosentti, numberFormat } from "@/lib/statistics";

test("formatCount shows a dash when the school was absent from the yhteishaku", () => {
  expect(formatCount(null)).toBe("–");
});

test("formatCount keeps Vipunen masking for counts under 5", () => {
  expect(formatCount(0)).toBe("alle 5");
  expect(formatCount(4)).toBe("alle 5");
  expect(formatCount(5)).toBe("5");
  expect(formatCount(23476)).toBe(numberFormat.format(23476));
});

test("formatSisaanpaasyprosentti uses a dash when counts are missing or masked", () => {
  const percentFormat = new Intl.NumberFormat("fi-FI", { style: "percent", maximumFractionDigits: 1 });
  expect(formatSisaanpaasyprosentti(null, null)).toBe("–");
  expect(formatSisaanpaasyprosentti(4, 10)).toBe("–");
  expect(formatSisaanpaasyprosentti(8, 40)).toBe(percentFormat.format(0.2));
});
