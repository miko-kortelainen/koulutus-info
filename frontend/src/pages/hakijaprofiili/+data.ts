import type { HakijaprofiiliResponse } from "@/api/dataValidation";
import { readHakijaprofiili } from "@/api/serverData";
import { DEFAULT_HAKIJAPROFIILI_ROUND } from "@/config/hakijaprofiiliRounds";

export interface HakijaprofiiliPageData {
  currentProfili: HakijaprofiiliResponse;
}

export const data = (): HakijaprofiiliPageData => ({
  currentProfili: readHakijaprofiili(DEFAULT_HAKIJAPROFIILI_ROUND),
});
