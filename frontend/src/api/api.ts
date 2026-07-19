import { parseCutoffSchools, parseStatistics } from "@/api/dataValidation";
import type { CutoffRound } from "@/config/cutoffRounds";
import type { YearOption } from "@/config/yearOptions";

async function fetchJson<T>(url: string, error: string, parse: (value: unknown, source: string) => T): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(error);
  return parse(await res.json(), url);
}

export const getCutoffSchools = (round: CutoffRound) =>
  fetchJson(`/data/pisterajat-${round}.json`, "failed to fetch cutoff data", parseCutoffSchools);

export const getStatistics = (year: YearOption) =>
  fetchJson(`/data/hakijamaarat-${year.replace("_", "-")}.json`, "failed to fetch statistics", parseStatistics);
