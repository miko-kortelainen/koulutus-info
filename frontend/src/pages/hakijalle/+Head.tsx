const description = "Työkaluja toisen asteen ja korkeakoulutuksen hakijalle.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/hakijalle/" rel="canonical" />
      <meta content="https://yhteishaku.app/hakijalle/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
