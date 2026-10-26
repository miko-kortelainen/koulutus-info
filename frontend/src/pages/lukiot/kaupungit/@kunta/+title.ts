import type { PageContext } from "vike/types";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import type { LukioKuntaPageData } from "@/pages/lukiot/kaupungit/@kunta/+data";
import { kunnanGenetiivi } from "@/pages/lukiot/kaupungit/lib/kuntienGenetiivit";

export default (pageContext: PageContext) => {
  const { kunta } = pageContext.data as LukioKuntaPageData;
  const genetiivi = kunnanGenetiivi(kunta);
  return genetiivi
    ? `${genetiivi} lukiot keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`
    : `${kunta}: lukiot ja keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`;
};
