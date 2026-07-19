import { useData } from "vike-react/useData";
import { slugifySchoolName } from "@/components/slug";
import { Head as GlobalHead } from "../../+Head";
import type { AlaPageData } from "./+data";

export function Head() {
  const { alaName } = useData<AlaPageData>();
  const url = `https://yhteishaku.app/pisterajat/${slugifySchoolName(alaName)}/`;
  const description = `${alaName} – yhteishaun pisterajat kouluittain eri hakukierroksilta.`;

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
