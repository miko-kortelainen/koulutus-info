const description =
  "Katso kuinka moni valmistunut on töissä kolmen vuoden kuluttua valmistumisesta koulutusaloittain: AMK, YAMK, kandi ja maisteri.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/tyollistyminen/" rel="canonical" />
      <meta content="https://yhteishaku.app/tyollistyminen/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
