import { expect, test } from "vitest";
import { localizedText } from "@/lib/localizedText";

test("prefers Finnish, then English, then Swedish", () => {
  expect(localizedText({ fi: "Oikeustiede", en: "Law", sv: "Juridik" })).toBe("Oikeustiede");
  expect(localizedText({ en: "Bachelor of Engineering, Chemical Engineering" })).toBe(
    "Bachelor of Engineering, Chemical Engineering",
  );
  expect(localizedText({ sv: "Juridik" })).toBe("Juridik");
  expect(localizedText({ fi: "", en: "Law" })).toBe("Law");
  expect(localizedText({})).toBe("virheellinen nimi");
});
