export function Head() {
  return (
    <>
      <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      <link href="/images/180x180.png" rel="apple-touch-icon" sizes="180x180" />
      <link href="/manifest.webmanifest" rel="manifest" />
      <style>{`
        @font-face {
          font-display: swap;
          font-family: "Google Sans Flex";
          font-style: normal;
          font-weight: 400 700;
          src: url("/fonts/google-sans-flex-latin-400-700.woff2") format("woff2");
        }
      `}</style>
      <link
        as="font"
        crossOrigin=""
        href="/fonts/google-sans-flex-latin-400-700.woff2"
        rel="preload"
        type="font/woff2"
      />
      <meta content="#80aa2a" media="(prefers-color-scheme: light)" name="theme-color" />
      <meta content="#1c2424" media="(prefers-color-scheme: dark)" name="theme-color" />
      <meta content="website" property="og:type" />
      <meta content="https://yhteishaku.app/images/og-img.png" property="og:image" />
      <meta content="summary_large_image" name="twitter:card" />
      <script async src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </>
  );
}
