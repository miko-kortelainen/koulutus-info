import { useData } from "vike-react/useData";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "../../../+Head";
import type { FeedbackPageData } from "./+data";

export function Head() {
  const { schoolName, year } = useData<FeedbackPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/opiskelijapalautteet/`;
  const description = `${schoolName} – vuoden ${year} opiskelijapalautteen vastaajamäärät ja keskiarvot koulutusaloittain.`;

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
