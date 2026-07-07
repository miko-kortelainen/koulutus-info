import { CURRENT_YEAR } from "@/pages/hakijamaarat/components/yearOptions";

export function Head() {
  const description = `Selaa korkeakoulujen yhteishaun hakijamääriä vuodelta ${CURRENT_YEAR} sekä aiemmilta vuosilta.`;

  return (
    <>
      <meta name="description" content={description} />
      <meta property="og:title" content="Hakijamäärät – korkeakoulujen yhteishaun tilastot" />
      <link rel="canonical" href="https://yhteishaku.app/hakijamaarat/" />
      <meta property="og:url" content="https://yhteishaku.app/hakijamaarat/" />
      <meta property="og:description" content={description} />
    </>
  );
}
