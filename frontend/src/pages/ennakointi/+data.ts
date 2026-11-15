import type { EnnakointiKoulutustarpeet } from "@/api/dataValidation";
import { readKoulutustarpeet } from "@/api/serverData";

export interface EnnakointiPageData {
  koulutustarpeet: EnnakointiKoulutustarpeet;
}

export const data = (): EnnakointiPageData => ({
  koulutustarpeet: readKoulutustarpeet(),
});
