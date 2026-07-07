import { readCurrentYearStatistics } from "@/api/loadData";
import type { StatisticsResponse } from "@/types.gen";

export const data = (): StatisticsResponse => readCurrentYearStatistics();
