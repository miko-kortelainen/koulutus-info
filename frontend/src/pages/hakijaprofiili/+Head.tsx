import { DEFAULT_HAKIJAPROFIILI_ROUND } from "@/config/hakijaprofiiliRounds";
import { statisticsRoundShortLabel } from "@/config/yearOptions";

export function Head() {
  const description = `Korkeakoulujen yhteishaun hakijaprofiili (${statisticsRoundShortLabel(DEFAULT_HAKIJAPROFIILI_ROUND)}): nais- ja mieshakijat sekä ikäryhmäjakauma korkeakouluittain, koulutusaloittain ja tutkintonimikkeittäin.`;

  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/hakijaprofiili/" rel="canonical" />
      <meta content="https://yhteishaku.app/hakijaprofiili/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
