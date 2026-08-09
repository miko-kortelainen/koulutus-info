import type { HakijaprofiiliCount, HakijaprofiiliEntity } from "@/api/dataValidation";
import { formatCount } from "@/lib/statistics";

const fiCollator = new Intl.Collator("fi");
const percentFormat = new Intl.NumberFormat("fi-FI", { style: "percent", maximumFractionDigits: 1 });

const GENDER_LABELS = ["nainen", "mies"] as const;

/** Sukupuoli: null or under 5 → 1-4 hakijaa (not alle 5). */
export const formatGenderCount = (lkm: number | null) => (isPublishableCount(lkm) ? formatCount(lkm) : "1-4 hakijaa");

export const isPublishableCount = (lkm: number | null): lkm is number => lkm != null && lkm >= 5;

/** Bar-list rows: omit null and under-five so shares/max use only published counts. */
export const publishableCounts = (counts: HakijaprofiiliCount[]) =>
  counts.filter((row): row is HakijaprofiiliCount & { lkm: number } => isPublishableCount(row.lkm));

/** True when sukupuoli or ikäryhmät still has at least one published (lkm ≥ 5) row. */
export const hasPublishableProfili = (entity: Pick<HakijaprofiiliEntity, "sukupuoli" | "ikaryhmat">) =>
  publishableCounts(entity.sukupuoli).length > 0 || publishableCounts(entity.ikaryhmat).length > 0;

/** Bars/% when every remaining part is published (lkm ≥ 5). */
export const canShowShares = (counts: HakijaprofiiliCount[]) =>
  counts.length > 0 && counts.every((row) => isPublishableCount(row.lkm));

export const shareOf = (lkm: number, total: number) => (total > 0 ? percentFormat.format(lkm / total) : "–");

export const breakdownTotal = (counts: HakijaprofiiliCount[]) =>
  canShowShares(counts) ? counts.reduce((sum, row) => sum + (row.lkm as number), 0) : null;

export const sortAgeBands = (counts: HakijaprofiiliCount[]) =>
  [...counts].sort((a, b) => {
    if (a.lkm === b.lkm) return fiCollator.compare(a.nimi, b.nimi);
    return (b.lkm ?? Number.NEGATIVE_INFINITY) - (a.lkm ?? Number.NEGATIVE_INFINITY);
  });

/** Always nainen then mies; missing labels become null (shown as 1-4 hakijaa). */
export const genderRowsForDisplay = (counts: HakijaprofiiliCount[]): HakijaprofiiliCount[] =>
  GENDER_LABELS.map((nimi) => {
    const found = counts.find((row) => row.nimi.toLocaleLowerCase("fi") === nimi);
    return { nimi, lkm: found?.lkm ?? null };
  });
