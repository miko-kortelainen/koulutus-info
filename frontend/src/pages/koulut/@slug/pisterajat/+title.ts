import type { PageContext } from "vike/types";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import type { CutoffPageData } from "@/pages/koulut/@slug/pisterajat/+data";

export default (pageContext: PageContext) =>
  `${(pageContext.data as CutoffPageData).schoolLabel} pisterajat ${DEFAULT_CUTOFF_YEAR}`;
