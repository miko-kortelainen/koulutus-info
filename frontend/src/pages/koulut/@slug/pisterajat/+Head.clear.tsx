import { useData } from "vike-react/useData";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import { slugify } from "@/lib/slug";
import { Head as GlobalHead } from "../../../+Head";
import type { CutoffPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<CutoffPageData>();
  const url = `https://yhteishaku.app/koulut/${slugify(schoolName)}/pisterajat/`;
  const description = `${schoolName} – pisterajat ${DEFAULT_CUTOFF_YEAR}`;

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
