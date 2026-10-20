import type { PageContext } from "vike/types";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import type { LukioSchoolPageData } from "@/pages/lukiot/@slug/+data";

export default (pageContext: PageContext) => {
  const { schoolName, entries } = pageContext.data as LukioSchoolPageData;
  const kunta = entries[0]?.kunta;
  const location = kunta ? ` (${kunta})` : "";
  return `${schoolName}${location} – keskiarvo ja pisterajat ${LUKIO_KESKIARVOT_YEAR}`;
};
