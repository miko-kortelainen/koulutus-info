import type { StatisticsEntry } from "@/types.gen";

const TIERS = [
  { maxExclusive: 1, label: "Matala", bg: "oklch(0.376 0.077 159.44)", color: "oklch(1 0 0)" },
  { maxExclusive: 2, label: "Keskiverto", bg: "oklch(0.476 0.128 39.44)", color: "oklch(1 0 0)" },
  { maxExclusive: Infinity, label: "Korkea", bg: "oklch(0.376 0.113 13.636)", color: "oklch(1 0 0)" },
] as const;

export const getTier = (ratio: number) => TIERS.find((t) => ratio < t.maxExclusive) ?? TIERS[TIERS.length - 1];

export const getHakijapaine = (entry: Pick<StatisticsEntry, "aloituspaikatLkm" | "ensisijaisetHakijatLkm">) =>
  entry.aloituspaikatLkm && entry.ensisijaisetHakijatLkm >= 5
    ? entry.ensisijaisetHakijatLkm / entry.aloituspaikatLkm
    : null;

export const numberFormat = new Intl.NumberFormat("fi-FI");
export const ratioFormat = new Intl.NumberFormat("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percentFormat = new Intl.NumberFormat("fi-FI", { style: "percent", maximumFractionDigits: 1 });

export const formatSisaanpaasyprosentti = (valitutLkm: number, kaikkiHakijatLkm: number) =>
  valitutLkm >= 5 && kaikkiHakijatLkm >= 5 ? percentFormat.format(valitutLkm / kaikkiHakijatLkm) : "–";

// Vipunen masks counts under 5
export const formatCount = (n: number) => (n < 5 ? "alle 5" : numberFormat.format(n));
