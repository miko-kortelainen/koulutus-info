const description = "Selaa yhteishaussa mukana olevia yliopistoja ja ammattikorkeakouluja sekä niiden hakijamääriä.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <meta content="Koulut – korkeakoulut yhteishaussa" property="og:title" />
      <link href="https://yhteishaku.app/koulut/" rel="canonical" />
      <meta content="https://yhteishaku.app/koulut/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
