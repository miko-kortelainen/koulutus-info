import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getHakijaprofiili } from "@/api/browserData";
import type { HakijaprofiiliResponse } from "@/api/dataValidation";
import type { HakijaprofiiliRound } from "@/config/hakijaprofiiliRounds";

export default function useHakijaprofiiliQuery(round: HakijaprofiiliRound, initialData?: HakijaprofiiliResponse) {
  return useQuery<HakijaprofiiliResponse>({
    queryKey: ["hakijaprofiili", round],
    queryFn: () => getHakijaprofiili(round),
    initialData,
    placeholderData: keepPreviousData,
    staleTime: Infinity,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
