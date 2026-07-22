import { useData } from "vike-react/useData";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "../../+Head";
import type { SchoolPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<SchoolPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/`;
  const description = `${schoolName} – yhteishaun koulutukset, hakijamäärät ja aloituspaikat.`;

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
