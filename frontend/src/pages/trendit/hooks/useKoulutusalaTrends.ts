import { useQueries } from "@tanstack/react-query";
import { getStatistics } from "@/api/api";
import { YEAR_OPTIONS } from "@/pages/hakijamaarat/components/yearOptions";
import type { StatisticsResponse } from "@/types.gen";

const TOP_N = 5;

function aggregate(data: StatisticsResponse): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of data) {
    const k = item.koulutusalaTaso1;
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + item.ensisijaisetHakijatLkm);
  }
  return map;
}

const years = YEAR_OPTIONS.map((y) => y.value); // ["2026", "2025", "2024", "2023"]
const chronological = [...years].reverse();       // ["2023", "2024", "2025", "2026"]

export type TrendPoint = { year: string } & Record<string, string | number>;

export function useKoulutusalaTrends(ssrData2026?: StatisticsResponse) {
  const results = useQueries({
    queries: years.map((year) => ({
      queryKey: ["statistics", year],
      queryFn: () => getStatistics(year),
      initialData: year === "2026" ? ssrData2026 : undefined,
      staleTime: Infinity,
      gcTime: 10 * 60 * 1000,
    })),
  });

  const isLoading = results.some((r) => r.isPending && !r.data);

  // Aggregate all years, keyed by year string
  const aggByYear = new Map(
    years.map((year, i) => [year, results[i]?.data ? aggregate(results[i].data!) : new Map<string, number>()])
  );

  // Union of all koulutusala names across all years
  const allNames = new Set<string>();
  for (const agg of aggByYear.values()) for (const k of agg.keys()) allNames.add(k);

  const latestAgg = aggByYear.get(years[0]) ?? new Map<string, number>();
  const oldestAgg = aggByYear.get(years[years.length - 1]) ?? new Map<string, number>();

  const topByGrowth = Array.from(allNames)
    .map((name) => ({ name, change: (latestAgg.get(name) ?? 0) - (oldestAgg.get(name) ?? 0) }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    .slice(0, TOP_N)
    .map(({ name }) => name);

  // Chart data includes all fields so either mode can slice from it
  const chartData: TrendPoint[] = chronological.map((year) => {
    const agg = aggByYear.get(year)!;
    const entry: TrendPoint = { year };
    for (const name of allNames) entry[name] = agg.get(name) ?? 0;
    return entry;
  });

  return { chartData, topByGrowth, isLoading };
}
