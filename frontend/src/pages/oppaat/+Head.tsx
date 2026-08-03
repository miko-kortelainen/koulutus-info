const description =
  "Oppaita ammattikorkeakoulujen ja yliopistojen todistusvalinnasta: pisteytys, valintajonot, kynnysehdot ja vähimmäispisteet.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/oppaat/" rel="canonical" />
      <meta content="https://yhteishaku.app/oppaat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
