import type { AmmattienPalkatData, KoulutusalaPalkatData, TyollistyminenData } from "@/api/dataValidation";
import { readAmmattienPalkat, readKoulutusalaPalkat, readTyollistyminen } from "@/api/serverData";

export interface TyollistyminenPageData {
  tyollistyminen: TyollistyminenData;
  koulutusalaPalkat: KoulutusalaPalkatData;
  ammattienPalkat: AmmattienPalkatData;
}

export const data = (): TyollistyminenPageData => ({
  tyollistyminen: readTyollistyminen(),
  koulutusalaPalkat: readKoulutusalaPalkat(),
  ammattienPalkat: readAmmattienPalkat(),
});
