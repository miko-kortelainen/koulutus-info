import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";

const description = `Toisen asteen yhteishaun ${LUKIO_KESKIARVOT_YEAR} lukioiden pisterajat. Yleislinjan pisteraja vastaa lukuaineiden keskiarvoa. Erityislinjojen pisteytyksessä on yleensä mukana myös lisänäyttö, pääsykoe tai painotettu arvosana.`;

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/lukiot/" rel="canonical" />
      <meta content="https://yhteishaku.app/lukiot/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
