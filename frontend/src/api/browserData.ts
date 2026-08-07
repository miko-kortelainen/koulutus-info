import { parseHakijaprofiili, parseStatistics } from "@/api/dataValidation";
import type { HakijaprofiiliRound } from "@/config/hakijaprofiiliRounds";
import type { YearOption } from "@/config/yearOptions";

async function fetchJson<T>(url: string, error: string, parse: (value: unknown, source: string) => T): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(error);
  return parse(await res.json(), url);
}

export const getStatistics = (year: YearOption) =>
  fetchJson(
    `/data/hakijamäärät/hakijamaarat-${year.replace("_", "-")}.json`,
    "failed to fetch statistics",
    parseStatistics,
  );

export const getHakijaprofiili = (round: HakijaprofiiliRound) =>
  fetchJson(
    `/data/hakijaprofiili/hakijaprofiili-${round.replace("_", "-")}.json`,
    "failed to fetch hakijaprofiili",
    parseHakijaprofiili,
  );
