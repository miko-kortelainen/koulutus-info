import { CURRENT_YEAR, statisticsRoundShortLabel } from "@/config/yearOptions";

export function Head() {
  const description = `Selaa korkeakoulujen yhteishaun hakijamääriä yhteishausta ${statisticsRoundShortLabel(CURRENT_YEAR)}.`;

  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/hakijamaarat/" rel="canonical" />
      <meta content="https://yhteishaku.app/hakijamaarat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
