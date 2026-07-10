import type { StatisticsEntry } from "@/types.gen";

// ponytail: tune cutoffs if tier distribution looks off in real data
const TIERS = [
  { maxExclusive: 3, label: "Matala", bg: "oklch(0.376 0.077 159.44)", color: "oklch(1 0 0)" },
  { maxExclusive: 10, label: "Keskiverto", bg: "oklch(0.476 0.128 39.44)", color: "oklch(1 0 0)" },
  { maxExclusive: Infinity, label: "Korkea", bg: "oklch(0.376 0.113 13.636)", color: "oklch(1 0 0)" },
] as const;

export const getTier = (ratio: number) => TIERS.find((t) => ratio < t.maxExclusive) ?? TIERS[TIERS.length - 1];

export const getHakijapaine = (entry: Pick<StatisticsEntry, "aloituspaikatLkm" | "ensisijaisetHakijatLkm">) =>
  entry.aloituspaikatLkm ? entry.ensisijaisetHakijatLkm / entry.aloituspaikatLkm : null;

export const numberFormat = new Intl.NumberFormat("fi-FI");

// Vipunen masks counts under 5
export const formatCount = (n: number) => (n < 5 ? "alle 5" : numberFormat.format(n));
