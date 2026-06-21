import type { SchoolsResponse, StatisticsResponse } from "../types.gen";

export async function getStatistics(): Promise<StatisticsResponse> {
  const res = await fetch("/data/statistics.json");
  if (!res.ok) throw new Error("failed to fetch statistics");
  return res.json();
}

export async function getSchools(): Promise<SchoolsResponse> {
  const res = await fetch("/data/schools.json");
  if (!res.ok) throw new Error("failed to fetch schools");
  return res.json();
}
