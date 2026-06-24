import type { YearOption } from "@/pages/hakijamaarat/components/YearControl";
import type { SchoolsResponse, StatisticsResponse } from "../types.gen";

export async function getStatistics(year: YearOption): Promise<StatisticsResponse> {
  const res = await fetch(`/data/statistics-${year}.json`);
  if (!res.ok) throw new Error("failed to fetch statistics");
  return res.json();
}

export async function getSchools(): Promise<SchoolsResponse> {
  const res = await fetch("/data/schools.json");
  if (!res.ok) throw new Error("failed to fetch schools");
  return res.json();
}
