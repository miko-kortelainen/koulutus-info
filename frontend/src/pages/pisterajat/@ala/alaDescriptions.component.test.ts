import { expect, test } from "vitest";
import { alaMetaDescription } from "@/pages/pisterajat/@ala/alaDescriptions";

test("alaMetaDescription returns keyword copy for a known ala", () => {
  expect(alaMetaDescription("Lääketieteet", "2026")).toContain("lääkiksen");
  expect(alaMetaDescription("Lääketieteet", "2026")).toContain("2026");
});

test("alaMetaDescription throws for an unknown ala", () => {
  expect(() => alaMetaDescription("Tuntematon ala", "2026")).toThrow(/Missing SEO description/);
});
