import { readPublicData } from "@/api/loadData";
import type { StatisticsResponse } from "@/types.gen";

export const data = (): StatisticsResponse => readPublicData("statistics-2026.json");
