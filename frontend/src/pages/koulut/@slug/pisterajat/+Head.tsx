import { useData } from "vike-react/useData";
import { slugifySchoolName } from "@/components/slug";
import type { CutoffPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<CutoffPageData>();
  const url = `https://yhteishaku.app/koulut/${slugifySchoolName(schoolName)}/pisterajat/`;
  const description = `${schoolName} – yhteishaun ohjelmakohtaiset pisterajat.`;

  return (
    <>
      <meta content={description} name="description" />
      <meta content={`${schoolName} – pisterajat`} property="og:title" />
      <link href={url} rel="canonical" />
      <meta content={url} property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
