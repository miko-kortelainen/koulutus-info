import { type SchoolsResponse, type VipunenData } from "../types.gen";

export async function getStatistics(sortQ?: string): Promise<VipunenData[]> {
  const res = await fetch(`/api/statistics?order=${sortQ || "asc"}`);
  if (!res.ok) throw new Error("failed to fetch statistics");
  return res.json();
}

export async function getSchools(): Promise<SchoolsResponse> {
  const res = await fetch(`/api/schools`);
  if (!res.ok) throw new Error("failed to fetch schools");
  return res.json();
}
