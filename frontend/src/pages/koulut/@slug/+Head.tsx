import { useData } from "vike-react/useData";
import { slugifySchoolName } from "@/components/slug";
import type { SchoolPageData } from "./+data";

export function Head() {
  const { schoolName } = useData<SchoolPageData>();
  const url = `https://yhteishaku.app/koulut/${slugifySchoolName(schoolName)}/`;
  const description = `${schoolName} – yhteishaun koulutukset, hakijamäärät ja aloituspaikat.`;

  return (
    <>
      <meta name="description" content={description} />
      <meta property="og:title" content={`${schoolName} – yhteishaun hakijamäärät ja koulutukset`} />
      <link rel="canonical" href={url} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={description} />
    </>
  );
}
