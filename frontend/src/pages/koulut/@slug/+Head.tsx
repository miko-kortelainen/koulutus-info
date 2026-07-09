import { useData } from "vike-react/useData";
import { slugifySchoolName } from "@/components/slug";
import type { SchoolPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<SchoolPageData>();
  const url = `https://yhteishaku.app/koulut/${slugifySchoolName(schoolName)}/`;
  const description = `${schoolName} – yhteishaun koulutukset, hakijamäärät ja aloituspaikat.`;

  return (
    <>
      <meta content={description} name="description" />
      <meta content={`${schoolName} – yhteishaun hakijamäärät ja koulutukset`} property="og:title" />
      <link href={url} rel="canonical" />
      <meta content={url} property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
