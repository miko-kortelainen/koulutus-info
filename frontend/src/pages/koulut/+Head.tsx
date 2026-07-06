const description = "Selaa yhteishaussa mukana olevia yliopistoja ja ammattikorkeakouluja sekä niiden hakijamääriä.";

export function Head() {
  return (
    <>
      <meta name="description" content={description} />
      <meta property="og:title" content="Koulut – korkeakoulut yhteishaussa" />
      <link rel="canonical" href="https://yhteishaku.app/koulut/" />
      <meta property="og:url" content="https://yhteishaku.app/koulut/" />
      <meta property="og:description" content={description} />
    </>
  );
}
