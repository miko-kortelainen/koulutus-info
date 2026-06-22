import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/api";
import type { StatisticsResponse } from "@/types.gen";
import type { YearOption } from "../components/YearControl";

export default function useStatisticsQuery(year: YearOption) {
  return useQuery<StatisticsResponse>({
    queryKey: ["statistics", year],
    queryFn: () => getStatistics(year),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // 10 min
  });
}
