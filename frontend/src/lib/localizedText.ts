import type { LanguageStrings } from "@/types.gen";

export function localizedText(value: LanguageStrings, fallback = "virheellinen nimi"): string {
  return value.fi || value.en || value.sv || fallback;
}
