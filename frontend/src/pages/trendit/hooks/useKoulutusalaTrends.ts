import { useQueries } from "@tanstack/react-query";
import { statisticsQueryOptions } from "@/hooks/useStatisticsQuery";
import { CURRENT_YEAR, YEAR_OPTIONS } from "@/pages/hakijamaarat/components/yearOptions";
import type { StatisticsResponse } from "@/types.gen";

const years = YEAR_OPTIONS.map((y) => y.value); // newest first
const chronological = [...years].reverse();

export type TrendPoint = { year: string; total: number };

export function useKoulutusalaTrends(ssrDataCurrentYear?: StatisticsResponse) {
  const results = useQueries({
    queries: years.map((year) => statisticsQueryOptions(year, year === CURRENT_YEAR ? ssrDataCurrentYear : undefined)),
  });

  const isLoading = results.some((r) => r.isPending && !r.data);

  const totalByYear = new Map(
    years.map((year, i) => [
      year,
      (results[i]?.data ?? []).reduce((sum, entry) => sum + entry.ensisijaisetHakijatLkm, 0),
    ]),
  );

  const chartData: TrendPoint[] = chronological.map((year) => ({ year, total: totalByYear.get(year) ?? 0 }));

  return { chartData, isLoading };
}
