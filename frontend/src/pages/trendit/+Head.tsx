const description =
  "Suosituimmat koulutusalat, korkeakoulut ja sektorit yhteishaun hakijamäärien perusteella sekä hakijamäärien vertailu vuosien välillä.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/trendit/" rel="canonical" />
      <meta content="https://yhteishaku.app/trendit/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
