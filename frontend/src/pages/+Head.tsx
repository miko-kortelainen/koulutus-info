import favicon from "../../public/favicon.png";

export function Head() {
  return (
    <>
      <link href={favicon} rel="icon" type="image/png" />
      <meta content="website" property="og:type" />
      <meta content="https://yhteishaku.app/images/og-img.jpg" property="og:image" />
      <meta content="summary_large_image" name="twitter:card" />
      <link href="/.well-known/api-catalog" rel="api-catalog" />
    </>
  );
}
