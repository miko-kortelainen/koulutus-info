import { useData } from "vike-react/useData";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "@/pages/+Head";
import type { AlaPageData } from "@/pages/pisterajat/@ala/+data";
import { alaMetaDescription } from "@/pages/pisterajat/@ala/alaDescriptions";

export function Head() {
  const { alaName } = useData<AlaPageData>();
  const url = `https://yhteishaku.app/pisterajat/${slugify(alaName)}/`;
  const description = alaMetaDescription(alaName, DEFAULT_CUTOFF_YEAR);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Yhteishaku.app", item: "https://yhteishaku.app/" },
      { "@type": "ListItem", position: 2, name: "Pisterajat", item: "https://yhteishaku.app/pisterajat/" },
      { "@type": "ListItem", position: 3, name: alaName, item: url },
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
