import { useData } from "vike-react/useData";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "@/pages/+Head";
import type { LukioKuntaPageData } from "@/pages/lukiot/kaupungit/@kunta/+data";
import { kunnanGenetiivi } from "@/pages/lukiot/kaupungit/lib/kuntienGenetiivit";

export function Head() {
  const { kunta } = useData<LukioKuntaPageData>();
  const url = `https://yhteishaku.app/lukiot/kaupungit/${slugify(kunta)}/`;
  const genetiivi = kunnanGenetiivi(kunta);
  const description = genetiivi
    ? `${genetiivi} lukiot ja niiden keskiarvorajat yhteishaussa ${LUKIO_KESKIARVOT_YEAR}. Katso lukioiden linjakohtaiset pisterajat.`
    : `${kunta}: lukiot ja niiden keskiarvorajat yhteishaussa ${LUKIO_KESKIARVOT_YEAR}. Katso lukioiden linjakohtaiset pisterajat.`;
  return (
    <>
      <GlobalHead />
      <meta content={description} name="description" />
      <link href={url} rel="canonical" />
      <meta content={url} property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
