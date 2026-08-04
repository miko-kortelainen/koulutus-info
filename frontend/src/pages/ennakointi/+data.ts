import { readKoulutustarpeet } from "@/api/serverData";
import type { EnnakointiKoulutustarpeet } from "@/api/dataValidation";

export interface EnnakointiPageData {
  koulutustarpeet: EnnakointiKoulutustarpeet;
}

export const data = (): EnnakointiPageData => ({
  koulutustarpeet: readKoulutustarpeet(),
});
