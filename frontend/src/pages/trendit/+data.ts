import { readCurrentYearStatistics, readPublicData } from "@/api/loadData";
import { YEAR_OPTIONS } from "@/config/yearOptions";
import type { StatisticsResponse } from "@/types.gen";

export interface TrendPoint {
  year: string;
  total: number;
}

export interface TrendsPageData {
  currentStatistics: StatisticsResponse;
  yearlyTotals: TrendPoint[];
}

export const data = (): TrendsPageData => ({
  currentStatistics: readCurrentYearStatistics(),
  yearlyTotals: [...YEAR_OPTIONS].reverse().map(({ value: year }) => {
    const statistics: StatisticsResponse = readPublicData(`statistics-${year}.json`);
    return {
      year,
      total: statistics.reduce((sum, entry) => sum + entry.ensisijaisetHakijatLkm, 0),
    };
  }),
});
