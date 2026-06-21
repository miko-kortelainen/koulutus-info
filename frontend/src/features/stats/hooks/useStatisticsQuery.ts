import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/api";
import type { StatisticsResponse } from "@/types.gen";

export default function useStatisticsQuery() {
  return useQuery<StatisticsResponse>({
    queryKey: ["statistics"],
    queryFn: getStatistics,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // 10 min
  });
}
