import type { PageContext } from "vike/types";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import type { LukioSchoolPageData } from "@/pages/lukiot/@slug/+data";

export default (pageContext: PageContext) => {
  const { schoolName } = pageContext.data as LukioSchoolPageData;
  return `${schoolName} – keskiarvo ja pisterajat ${LUKIO_KESKIARVOT_YEAR}`;
};
