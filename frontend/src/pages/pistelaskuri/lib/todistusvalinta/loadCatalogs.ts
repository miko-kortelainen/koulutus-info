import type { CutoffRound } from "@/config/cutoffRounds";
import type {
  CutoffSchool,
  ProgramCrosswalk,
  ScoringCatalog,
  ThresholdCatalog,
  TodistusvalintaCatalogs,
} from "./types";

let catalogsPromise: Promise<TodistusvalintaCatalogs> | null = null;
const cutoffCache = new Map<string, Promise<CutoffSchool[]>>();

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url} (${response.status})`);
  return (await response.json()) as T;
}

export async function ensureCatalogs(): Promise<TodistusvalintaCatalogs> {
  if (catalogsPromise === null) {
    catalogsPromise = Promise.all([
      fetchJson<ScoringCatalog>("/data/todistusvalinta/scoring-models-2026.json"),
      fetchJson<ThresholdCatalog>("/data/todistusvalinta/threshold-rules-2026.json"),
      fetchJson<ProgramCrosswalk>("/data/todistusvalinta/program-crosswalk-2026.json"),
    ])
      .then(([scoring, thresholds, crosswalk]) => ({ scoring, thresholds, crosswalk }))
      .catch((error) => {
        catalogsPromise = null;
        throw error;
      });
  }
  return catalogsPromise;
}

export async function loadCutoffSchools(round: CutoffRound, sector: "yliopisto" | "amk"): Promise<CutoffSchool[]> {
  const key = `${round}:${sector}`;
  let pending = cutoffCache.get(key);
  if (pending === undefined) {
    pending = fetchJson<CutoffSchool[]>(`/data/pisterajat/pisterajat-${round}-${sector}.json`).catch((error) => {
      cutoffCache.delete(key);
      throw error;
    });
    cutoffCache.set(key, pending);
  }
  return pending;
}
