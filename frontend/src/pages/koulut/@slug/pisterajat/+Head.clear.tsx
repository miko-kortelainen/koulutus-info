import { useData } from "vike-react/useData";
import { slugifySchoolName } from "@/components/slug";
import { Head as GlobalHead } from "../../../+Head";
import type { CutoffPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<CutoffPageData>();
  const url = `https://yhteishaku.app/koulut/${slugifySchoolName(schoolName)}/pisterajat/`;
  const description = `${schoolName} – yhteishaun pisterajat 2026.`;

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
