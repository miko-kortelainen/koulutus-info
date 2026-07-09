export function Head() {
  return (
    <>
      <link href="/favicon.png" rel="icon" type="image/png" />
      <link href="https://fonts.googleapis.com" rel="preconnect" />
      <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
      <link
        href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wdth,wght@6..144,25..151,1..1000&display=swap"
        rel="stylesheet"
      />
      <meta content="website" property="og:type" />
      <meta content="https://yhteishaku.app/images/og-img.png" property="og:image" />
      <meta content="summary_large_image" name="twitter:card" />
      <link href="/.well-known/api-catalog" rel="api-catalog" />
    </>
  );
}
