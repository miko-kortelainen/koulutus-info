const description =
  "Ylioppilaskokeiden pisterajat keväiltä ja syksyiltä. Pisteraja on alin pistemäärä, jolla arvosanan saa.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/yo-pisterajat/" rel="canonical" />
      <meta content="https://yhteishaku.app/yo-pisterajat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
