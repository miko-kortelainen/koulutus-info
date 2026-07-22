const description = "Näin lisäät yhteishaku.app-palvelun iPhonen kotinäyttöön Safarissa.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/asenna/" rel="canonical" />
      <meta content="https://yhteishaku.app/asenna/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
