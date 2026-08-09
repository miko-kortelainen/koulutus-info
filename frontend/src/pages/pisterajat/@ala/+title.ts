import type { PageContext } from "vike/types";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import type { AlaPageData } from "@/pages/pisterajat/@ala/+data";

export default (pageContext: PageContext) =>
  `${(pageContext.data as AlaPageData).alaName} – pisterajat ${DEFAULT_CUTOFF_YEAR}`;
