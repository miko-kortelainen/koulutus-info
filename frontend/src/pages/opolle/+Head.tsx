const description = "Työkaluja toisen asteen ja korkeakoulutuksen opinto-ohjaukseen.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/opolle/" rel="canonical" />
      <meta content="https://yhteishaku.app/opolle/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
