import type { PageContext } from "vike/types";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import { schoolNameWithShort } from "@/config/schoolShortNames";
import type { CutoffPageData } from "./+data";

export default (pageContext: PageContext) =>
  `${schoolNameWithShort((pageContext.data as CutoffPageData).schoolName)} - pisterajat ${DEFAULT_CUTOFF_YEAR}`;
