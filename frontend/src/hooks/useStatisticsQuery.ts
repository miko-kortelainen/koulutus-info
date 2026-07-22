import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/browserData";
import type { YearOption } from "@/config/yearOptions";
import type { StatisticsResponse } from "@/types.gen";

export default function useStatisticsQuery(year: YearOption, initialData?: StatisticsResponse, enabled = true) {
  return useQuery<StatisticsResponse>({
    queryKey: ["statistics", year],
    queryFn: () => getStatistics(year),
    initialData,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    enabled,
    refetchOnWindowFocus: false,
  });
}
