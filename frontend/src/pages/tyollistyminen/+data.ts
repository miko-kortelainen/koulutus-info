import type { TyollistyminenData } from "@/api/dataValidation";
import { readTyollistyminen } from "@/api/serverData";

export interface TyollistyminenPageData {
  tyollistyminen: TyollistyminenData;
}

export const data = (): TyollistyminenPageData => ({
  tyollistyminen: readTyollistyminen(),
});
