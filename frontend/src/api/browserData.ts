import { parseCutoffSchools, parseStatistics } from "@/api/dataValidation";
import type { CutoffRound } from "@/config/cutoffRounds";
import type { YearOption } from "@/config/yearOptions";

async function fetchJson<T>(url: string, error: string, parse: (value: unknown, source: string) => T): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(error);
  return parse(await res.json(), url);
}

export const getCutoffSchools = async (round: CutoffRound) =>
  (
    await Promise.all(
      (["amk", "yliopisto"] as const).map((sector) =>
        fetchJson(
          `/data/pisterajat/pisterajat-${round}-${sector}.json`,
          "failed to fetch cutoff data",
          parseCutoffSchools,
        ),
      ),
    )
  ).flat();

export const getStatistics = (year: YearOption) =>
  fetchJson(`/data/hakijamaarat-${year.replace("_", "-")}.json`, "failed to fetch statistics", parseStatistics);
