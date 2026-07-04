import favicon from "../../public/favicon.png";

export function Head() {
  return (
    <>
      <link rel="icon" href={favicon} type="image/svg+xml" />
      <meta
        name="description"
        content="Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa."
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content="Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa."
      />
      <meta property="og:image" content="https://yhteishaku.app/images/og-img.jpg" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="api-catalog" href="/.well-known/api-catalog" />
    </>
  );
}
