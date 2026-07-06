import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/api";
import type { StatisticsResponse } from "@/types.gen";
import type { YearOption } from "@/pages/hakijamaarat/components/yearOptions";

export const statisticsQueryOptions = (year: YearOption, initialData?: StatisticsResponse) => ({
  queryKey: ["statistics", year],
  queryFn: () => getStatistics(year),
  initialData,
  staleTime: Infinity,
  gcTime: 10 * 60 * 1000,
});

export default function useStatisticsQuery(year: YearOption, initialData?: StatisticsResponse, enabled = true) {
  return useQuery<StatisticsResponse>({
    ...statisticsQueryOptions(year, initialData),
    enabled,
    refetchOnWindowFocus: false,
  });
}
