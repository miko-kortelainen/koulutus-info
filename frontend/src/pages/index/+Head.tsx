const description = "Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/" rel="canonical" />
      <meta content="https://yhteishaku.app/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
