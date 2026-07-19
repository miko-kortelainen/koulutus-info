import type { PageContext } from "vike/types";
import { cutoffRoundYear, DEFAULT_CUTOFF_ROUND } from "@/config/cutoffRounds";
import type { CutoffPageData } from "./+data";

export default (pageContext: PageContext) =>
  `${(pageContext.data as CutoffPageData).schoolName} – ${cutoffRoundYear(DEFAULT_CUTOFF_ROUND)} pisterajat`;
