import { useData } from "vike-react/useData";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "@/pages/+Head";
import type { FeedbackPageData } from "@/pages/koulut/@slug/opiskelijapalautteet/+data";

export function Head() {
  const { schoolName, year } = useData<FeedbackPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/opiskelijapalautteet/`;
  const description = `${schoolName}: vuoden ${year} opiskelijapalaute. Palautekyselyn vastaajamäärät ja keskiarvot koulutusaloittain ja aiheittain.`;

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
