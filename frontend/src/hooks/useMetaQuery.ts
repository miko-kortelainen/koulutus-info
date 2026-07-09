import { useQuery } from "@tanstack/react-query";
import { getMeta } from "@/api/api";
import type { Meta } from "@/types.gen";

export const metaQueryOptions = () => ({
  queryKey: ["meta"],
  queryFn: getMeta,
  staleTime: Infinity,
  gcTime: 10 * 60 * 1000,
  retry: false,
});

export default function useMetaQuery() {
  return useQuery<Meta>({ ...metaQueryOptions(), refetchOnWindowFocus: false });
}
