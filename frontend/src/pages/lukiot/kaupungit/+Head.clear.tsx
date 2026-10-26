import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import { Head as GlobalHead } from "@/pages/+Head";

export function Head() {
  const url = "https://yhteishaku.app/lukiot/kaupungit/";
  const description = `Lukiot ja niiden keskiarvorajat kunnittain yhteishaussa ${LUKIO_KESKIARVOT_YEAR}.`;
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
