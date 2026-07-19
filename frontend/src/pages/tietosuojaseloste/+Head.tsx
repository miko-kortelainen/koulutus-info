const description = "Yhteishaku.app tietosuojaseloste.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/tietosuojaseloste/" rel="canonical" />
      <meta content="https://yhteishaku.app/tietosuojaseloste/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
