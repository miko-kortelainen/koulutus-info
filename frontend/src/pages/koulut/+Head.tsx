const description =
  "Yhteishaun yliopistot ja ammattikorkeakoulut: hakijamäärät, sisäänpääsyprosentit, hakijapaine ja opiskelijapalautteen keskiarvot.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/koulut/" rel="canonical" />
      <meta content="https://yhteishaku.app/koulut/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
