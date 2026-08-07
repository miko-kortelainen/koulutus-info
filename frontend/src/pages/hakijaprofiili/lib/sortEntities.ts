import type { HakijaprofiiliEntity } from "@/api/dataValidation";
import { publishableCounts } from "./masking";

export type SortOption =
  | "asc"
  | "desc"
  | "most_female"
  | "most_male"
  | "most_female_count"
  | "most_male_count"
  | "least_female_count"
  | "least_male_count";

const fiCollator = new Intl.Collator("fi");

/** Publishable gender count (≥ 5); missing, null, or under five → null for ordering. */
export function publishableGenderCount(
  entity: Pick<HakijaprofiiliEntity, "sukupuoli">,
  gender: "nainen" | "mies",
): number | null {
  const row = entity.sukupuoli.find((entry) => entry.nimi.toLocaleLowerCase("fi") === gender);
  if (row == null || row.lkm == null || row.lkm < 5) return null;
  return row.lkm;
}

/**
 * Share of `gender` among publishable sukupuoli counts (lkm ≥ 5 only).
 * Missing/under-five target gender or zero publishable total → null (sort last).
 */
export function genderShare(entity: Pick<HakijaprofiiliEntity, "sukupuoli">, gender: "nainen" | "mies"): number | null {
  const count = publishableGenderCount(entity, gender);
  if (count == null) return null;
  const total = publishableCounts(entity.sukupuoli).reduce((sum, row) => sum + row.lkm, 0);
  if (total === 0) return null;
  return count / total;
}

/** Absolute count for vähiten sorts: publishable (≥5) lkm, else 0 so missing ranks among fewest. */
function leastSortGenderCount(entity: Pick<HakijaprofiiliEntity, "sukupuoli">, gender: "nainen" | "mies"): number {
  return publishableGenderCount(entity, gender) ?? 0;
}

type MetricDirection = "asc" | "desc";

/** Desc: null → −∞ so higher values win; asc: null → +∞ so lower values win. Both keep nulls last. */
const nullsLastKey = (value: number | null, direction: MetricDirection) =>
  value == null ? (direction === "asc" ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY) : value;

function compareByGenderMetric(
  a: HakijaprofiiliEntity,
  b: HakijaprofiiliEntity,
  gender: "nainen" | "mies",
  metric: (entity: HakijaprofiiliEntity, gender: "nainen" | "mies") => number | null,
  direction: MetricDirection = "desc",
): number {
  const av = nullsLastKey(metric(a, gender), direction);
  const bv = nullsLastKey(metric(b, gender), direction);
  if (av !== bv) return direction === "asc" ? av - bv : bv - av;
  return fiCollator.compare(a.kohdeNimi, b.kohdeNimi);
}

export function sortEntities(entities: HakijaprofiiliEntity[], order: SortOption): HakijaprofiiliEntity[] {
  return [...entities].sort((a, b) => {
    switch (order) {
      case "desc":
        return fiCollator.compare(b.kohdeNimi, a.kohdeNimi);
      case "most_female":
        return compareByGenderMetric(a, b, "nainen", genderShare);
      case "most_male":
        return compareByGenderMetric(a, b, "mies", genderShare);
      case "most_female_count":
        return compareByGenderMetric(a, b, "nainen", publishableGenderCount);
      case "most_male_count":
        return compareByGenderMetric(a, b, "mies", publishableGenderCount);
      case "least_female_count":
        return compareByGenderMetric(a, b, "nainen", leastSortGenderCount, "asc");
      case "least_male_count":
        return compareByGenderMetric(a, b, "mies", leastSortGenderCount, "asc");
      default:
        return fiCollator.compare(a.kohdeNimi, b.kohdeNimi);
    }
  });
}
