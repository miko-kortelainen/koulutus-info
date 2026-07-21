import { getSisaanpaasyprosentti } from "@/lib/statistics";
import type { StatisticsEntry } from "@/types.gen";

export type SortOption =
  | "asc"
  | "desc"
  | "most_popular"
  | "least_popular"
  | "most_spots"
  | "least_spots"
  | "highest_acceptance_rate"
  | "lowest_acceptance_rate";

export function sortStatistics<T extends StatisticsEntry>(statistics: T[], order: SortOption): T[] {
  return [...statistics].sort((a, b) => {
    switch (order) {
      case "desc":
        return b.hakukohde.localeCompare(a.hakukohde, "fi");
      case "most_popular":
        return b.kaikkiHakijatLkm - a.kaikkiHakijatLkm;
      case "least_popular":
        return a.kaikkiHakijatLkm - b.kaikkiHakijatLkm;
      case "most_spots":
        return b.aloituspaikatLkm - a.aloituspaikatLkm;
      case "least_spots":
        return a.aloituspaikatLkm - b.aloituspaikatLkm;
      case "highest_acceptance_rate":
      case "lowest_acceptance_rate": {
        const aPercentage = getSisaanpaasyprosentti(a.valitutLkm, a.kaikkiHakijatLkm);
        const bPercentage = getSisaanpaasyprosentti(b.valitutLkm, b.kaikkiHakijatLkm);
        if (aPercentage == null) return bPercentage == null ? 0 : 1;
        if (bPercentage == null) return -1;
        return order === "highest_acceptance_rate" ? bPercentage - aPercentage : aPercentage - bPercentage;
      }
      case "asc":
        return a.hakukohde.localeCompare(b.hakukohde, "fi");
      default:
        return 0;
    }
  });
}
