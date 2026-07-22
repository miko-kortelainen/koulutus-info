import { readCurrentYearStatistics } from "@/api/serverData";
import type { StatisticsResponse } from "@/types.gen";

export const data = (): StatisticsResponse => readCurrentYearStatistics();
