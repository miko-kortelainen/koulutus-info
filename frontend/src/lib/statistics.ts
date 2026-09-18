const TIERS = [
  { maxExclusive: 1, label: "Matala", bg: "oklch(0.376 0.077 159.44)", color: "oklch(1 0 0)" },
  { maxExclusive: 2, label: "Keskiverto", bg: "oklch(0.476 0.128 39.44)", color: "oklch(1 0 0)" },
  { maxExclusive: Infinity, label: "Korkea", bg: "oklch(0.376 0.113 13.636)", color: "oklch(1 0 0)" },
] as const;

export const getTier = (ratio: number) => TIERS.find((t) => ratio < t.maxExclusive) ?? TIERS[TIERS.length - 1];

export const getHakijapaine = (entry: { aloituspaikatLkm: number | null; ensisijaisetHakijatLkm: number | null }) =>
  entry.aloituspaikatLkm && entry.ensisijaisetHakijatLkm != null && entry.ensisijaisetHakijatLkm >= 5
    ? entry.ensisijaisetHakijatLkm / entry.aloituspaikatLkm
    : null;

export const numberFormat = new Intl.NumberFormat("fi-FI");
export const ratioFormat = new Intl.NumberFormat("fi-FI", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const percentFormat = new Intl.NumberFormat("fi-FI", { style: "percent", maximumFractionDigits: 1 });

export const getSisaanpaasyprosentti = (valitutLkm: number | null, kaikkiHakijatLkm: number | null) =>
  valitutLkm != null && kaikkiHakijatLkm != null && valitutLkm >= 5 && kaikkiHakijatLkm >= 5
    ? valitutLkm / kaikkiHakijatLkm
    : null;

export const formatSisaanpaasyprosentti = (valitutLkm: number | null, kaikkiHakijatLkm: number | null) => {
  const percentage = getSisaanpaasyprosentti(valitutLkm, kaikkiHakijatLkm);
  return percentage != null ? percentFormat.format(percentage) : "–";
};

// null is missing data; Vipunen masks published counts under 5
export const formatCount = (n: number | null) => {
  if (n == null) return "–";
  if (n < 5) return "alle 5";
  return numberFormat.format(n);
};
