import { type VipunenData } from "./types.gen";

export async function getStatistics(): Promise<VipunenData[]> {
  const res = await fetch("/api/statistics");
  if (!res.ok) throw new Error("failed to fetch statistics");
  return res.json();
}
