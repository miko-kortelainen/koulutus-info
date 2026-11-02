const description =
  "Katso kuinka moni valmistunut työllistyy vuoden ja kolmen vuoden kuluttua valmistumisesta koulutusaloittain: AMK, alempi ja ylempi korkeakoulututkinto.";

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
