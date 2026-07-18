import { readCurrentYearStatistics, readStatistics } from "@/api/loadData";
import { statisticsRoundShortLabel, YEAR_OPTIONS } from "@/config/yearOptions";
import type { StatisticsResponse } from "@/types.gen";

export interface TrendPoint {
  year: string;
  total: number;
}

export interface TrendsPageData {
  currentStatistics: StatisticsResponse;
  springTotals: TrendPoint[];
  autumnTotals: TrendPoint[];
}

const totalsForSeason = (season: "kevat" | "syksy") =>
  [...YEAR_OPTIONS]
    .reverse()
    .filter(({ value }) => value.endsWith(`_${season}`))
    .map(({ value: year }) => {
      const statistics = readStatistics(year);
      return {
        year: statisticsRoundShortLabel(year),
        total: statistics.reduce((sum, entry) => sum + entry.ensisijaisetHakijatLkm, 0),
      };
    });

export const data = (): TrendsPageData => ({
  currentStatistics: readCurrentYearStatistics(),
  springTotals: totalsForSeason("kevat"),
  autumnTotals: totalsForSeason("syksy"),
});
