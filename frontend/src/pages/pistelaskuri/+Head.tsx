const description =
  "Laske YO- tai AMM-todistuspisteet ja vertaa tulosta vuoden 2026 suuntaa-antaviin AMK-pisterajoihin.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <meta content="Pistelaskuri – laske yhteishaun todistusvalintapisteesi" property="og:title" />
      <link href="https://yhteishaku.app/pistelaskuri/" rel="canonical" />
      <meta content="https://yhteishaku.app/pistelaskuri/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
