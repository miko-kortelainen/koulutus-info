import { readCurrentYearStatistics, readMeta } from "@/api/serverData";
import type { StatisticsResponse } from "@/types.gen";

export interface HakijamaaratPageData {
  statistics: StatisticsResponse;
  statisticsUpdatedAt?: string;
}

export const data = (): HakijamaaratPageData => ({
  statistics: readCurrentYearStatistics(),
  statisticsUpdatedAt: readMeta().statisticsUpdatedAt,
});
