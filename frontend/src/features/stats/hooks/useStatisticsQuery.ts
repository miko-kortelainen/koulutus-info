import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/api";
import type { StatisticsResponse } from "@/types.gen";
import type { SortOption } from "../components/SortControl";

export default function useStatisticsQuery(sortOrder: SortOption) {
  return useQuery<StatisticsResponse>({
    queryKey: ["statistics", sortOrder],
    queryFn: () => getStatistics(sortOrder),
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // 10 min
  });
}
