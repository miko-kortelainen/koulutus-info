import type { YoPisterajatRound } from "@/api/dataValidation";
import { readYoPisterajat } from "@/api/serverData";

export type YoPisterajatPageData = YoPisterajatRound[];

export const data = (): YoPisterajatPageData => readYoPisterajat();
