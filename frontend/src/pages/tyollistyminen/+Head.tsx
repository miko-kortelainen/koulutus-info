const description =
  "Katso valmistuneiden työllistyminen kolmen vuoden kuluttua koulutusaloittain sekä kokoaikaisten palkansaajien mediaanipalkat aloittain ja ammateittain.";

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
