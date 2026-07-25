import { CURRENT_YEAR } from "@/config/yearOptions";

const description = `Korkeakoulujen yhteishaku ${CURRENT_YEAR.slice(
  0,
  4,
)}: hakuajat, koulutukset, hakijamäärät, pisterajat ja todistusvalintalaskuri.`;

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/" rel="canonical" />
      <meta content="https://yhteishaku.app/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
