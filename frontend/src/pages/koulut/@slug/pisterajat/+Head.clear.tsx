import { useData } from "vike-react/useData";
import { slugify } from "@/components/slug";
import { Head as GlobalHead } from "../../../+Head";
import type { CutoffPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<CutoffPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/pisterajat/`;
  const description = `${schoolName} – yhteishaun pisterajat eri hakukierroksilta.`;

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
