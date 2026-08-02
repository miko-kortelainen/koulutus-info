import { useData } from "vike-react/useData";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "../../+Head";
import type { SchoolPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<SchoolPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/`;
  const description = `${schoolName}: tutustu yhteishaun koulutuksiin, hakijamääriin, aloituspaikkoihin ja pisterajoihin.`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Yhteishaku.app", item: "https://yhteishaku.app/" },
      { "@type": "ListItem", position: 2, name: "Korkeakoulut", item: "https://yhteishaku.app/koulut/" },
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
