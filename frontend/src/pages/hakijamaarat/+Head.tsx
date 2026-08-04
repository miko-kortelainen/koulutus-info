import { CURRENT_YEAR, statisticsRoundShortLabel } from "@/config/yearOptions";

export function Head() {
  const description = `Korkeakoulujen yhteishaun hakijamäärät (${statisticsRoundShortLabel(CURRENT_YEAR)}): hakijat, aloituspaikat, sisäänpääsyprosentit ja hakijapaine hakukohteittain.`;

  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/hakijamaarat/" rel="canonical" />
      <meta content="https://yhteishaku.app/hakijamaarat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
