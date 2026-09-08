import { useData } from "vike-react/useData";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "@/pages/+Head";
import type { LukioSchoolPageData } from "@/pages/lukiot/@slug/+data";

export function Head() {
  const { schoolName } = useData<LukioSchoolPageData>();
  const url = `https://yhteishaku.app/lukiot/${slugify(schoolName)}/`;
  const description = `${schoolName}: vuoden ${LUKIO_KESKIARVOT_YEAR} yhteishaun alin hyväksytty keskiarvo ja linjakohtaiset pisterajat.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Yhteishaku.app", item: "https://yhteishaku.app/" },
      { "@type": "ListItem", position: 2, name: "Lukiot", item: "https://yhteishaku.app/lukiot/" },
      { "@type": "ListItem", position: 3, name: schoolName, item: url },
    ],
  };

  return (
    <>
      <GlobalHead />
      <meta content={description} name="description" />
      <link href={url} rel="canonical" />
      <meta content={url} property="og:url" />
      <meta content={description} property="og:description" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}
