import { useQuery } from "@tanstack/react-query";
import { getSchools } from "@/api/api";
import type { SchoolsResponse } from "@/types.gen";

export default function useSchoolsQuery(initialData?: SchoolsResponse) {
  return useQuery<SchoolsResponse>({
    queryKey: ["schools"],
    queryFn: () => getSchools(),
    initialData,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000, // 10 min
    retry: false,
  });
}
