const description = "Vastauksia yleisimpiin kysymyksiin Yhteishaku.app-sivustosta.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/ukk/" rel="canonical" />
      <meta content="https://yhteishaku.app/ukk/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
