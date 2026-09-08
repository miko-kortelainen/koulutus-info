import type { PageContext } from "vike/types";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import type { LukioSchoolPageData } from "@/pages/lukiot/@slug/+data";

export default (pageContext: PageContext) =>
  `${(pageContext.data as LukioSchoolPageData).schoolName} keskiarvo ${LUKIO_KESKIARVOT_YEAR} – yhteishaku`;
