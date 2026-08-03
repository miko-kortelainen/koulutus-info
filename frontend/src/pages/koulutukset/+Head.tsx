const description =
  "Yhteishaun yliopisto- ja AMK-koulutukset: hakukohteet, paikkakunnat, koulutusasteet ja tallennus omalle hakulistalle.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/koulutukset/" rel="canonical" />
      <meta content="https://yhteishaku.app/koulutukset/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
