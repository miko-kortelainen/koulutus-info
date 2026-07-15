import type { CutoffRound } from "@/config/cutoffRounds";
import type { YearOption } from "@/config/yearOptions";
import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import type { Meta, SchoolsResponse, StatisticsResponse } from "../types.gen";

export async function getCutoffSchools(round: CutoffRound): Promise<CutoffSchool[]> {
  const res = await fetch(`/data/pisterajat-${round}.json`);
  if (!res.ok) throw new Error("failed to fetch cutoff data");
  return res.json();
}

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

export async function getMeta(): Promise<Meta> {
  const res = await fetch("/data/meta.json");
  if (!res.ok) throw new Error("failed to fetch meta");
  return res.json();
}
