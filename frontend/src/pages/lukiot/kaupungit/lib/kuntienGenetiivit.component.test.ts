import { expect, test } from "vitest";
import { kunnanGenetiivi } from "@/pages/lukiot/kaupungit/lib/kuntienGenetiivit";

test("uses the municipality's genitive form", () => {
  expect(kunnanGenetiivi("Helsinki")).toBe("Helsingin");
  expect(kunnanGenetiivi("Virrat")).toBe("Virtain");
  expect(kunnanGenetiivi("Kaustinen")).toBe("Kaustisen");
  expect(kunnanGenetiivi("Uusikaupunki")).toBe("Uudenkaupungin");
  expect(kunnanGenetiivi("Tuntematon kunta")).toBeUndefined();
});
