import { useData } from "vike-react/useData";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "../../+Head";
import type { AlaPageData } from "./+data";

export function Head() {
  const { alaName } = useData<AlaPageData>();
  const url = `https://yhteishaku.app/pisterajat/${slugify(alaName)}/`;
  const description = `${alaName} – yhteishaun pisterajat ${DEFAULT_CUTOFF_YEAR}`;

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
