const description = "Arvioi vuoden 2026 pisterajojen perusteella, mihin AMK-koulutuksiin pisteesi olisivat riittäneet.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <meta content="Pistelaskuri – mihin pisteeni riittävät?" property="og:title" />
      <link href="https://yhteishaku.app/pistelaskuri/" rel="canonical" />
      <meta content="https://yhteishaku.app/pistelaskuri/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
