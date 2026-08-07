import { useData } from "vike-react/useData";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "../../../+Head";
import type { CutoffPageData } from "./+data";

export function Head() {
  const { schoolName, schoolLabel } = useData<CutoffPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/pisterajat/`;
  const schoolUrl = `https://yhteishaku.app/koulut/${slugify(schoolName)}/`;
  const description = `${schoolLabel}: katso vuoden ${DEFAULT_CUTOFF_YEAR} yhteishaun alimmat hyväksytyt pistemäärät koulutuksittain ja valintatavoittain.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Yhteishaku.app", item: "https://yhteishaku.app/" },
      { "@type": "ListItem", position: 2, name: "Korkeakoulut", item: "https://yhteishaku.app/koulut/" },
      { "@type": "ListItem", position: 3, name: schoolName, item: schoolUrl },
      { "@type": "ListItem", position: 4, name: "Pisterajat", item: url },
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
