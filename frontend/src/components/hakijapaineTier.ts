// ponytail: tune cutoffs if tier distribution looks off in real data
export const TIERS = [
  { maxExclusive: 3, label: "Matala", bg: "oklch(0.376 0.077 159.44)", color: "oklch(1 0 0)" },
  { maxExclusive: 10, label: "Keskiverto", bg: "oklch(0.476 0.128 39.44)", color: "oklch(1 0 0)" },
  { maxExclusive: Infinity, label: "Korkea", bg: "oklch(0.376 0.113 13.636)", color: "oklch(1 0 0)" },
] as const;

export const getTier = (ratio: number) => TIERS.find((t) => ratio < t.maxExclusive)!;
