import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/api";
import type { StatisticsResponse } from "@/types.gen";
import type { YearOption } from "../components/yearOptions";

export default function useStatisticsQuery(year: YearOption, initialData?: StatisticsResponse, enabled = true) {
  return useQuery<StatisticsResponse>({
    queryKey: ["statistics", year],
    queryFn: () => getStatistics(year),
    initialData,
    enabled,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
  });
}
