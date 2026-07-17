import type { CutoffRound } from "@/config/cutoffRounds";
import type { YearOption } from "@/config/yearOptions";
import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import type { StatisticsResponse } from "../types.gen";

async function fetchJson<T>(url: string, error: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(error);
  return res.json();
}

export const getCutoffSchools = (round: CutoffRound) =>
  fetchJson<CutoffSchool[]>(`/data/pisterajat-${round}.json`, "failed to fetch cutoff data");

export const getStatistics = (year: YearOption) =>
  fetchJson<StatisticsResponse>(`/data/hakijamaarat-${year.replace("_", "-")}.json`, "failed to fetch statistics");
