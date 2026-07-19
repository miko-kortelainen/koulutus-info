const description = "Yhteishaun pisterajat koulutusaloittain ja kouluittain eri hakukierroksilta.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/pisterajat/" rel="canonical" />
      <meta content="https://yhteishaku.app/pisterajat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
