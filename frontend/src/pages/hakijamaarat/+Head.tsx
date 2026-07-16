import { CURRENT_YEAR } from "@/config/yearOptions";

export function Head() {
  const description = `Selaa korkeakoulujen yhteishaun hakijamääriä vuodelta ${CURRENT_YEAR} sekä aiemmilta vuosilta.`;

  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/hakijamaarat/" rel="canonical" />
      <meta content="https://yhteishaku.app/hakijamaarat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
