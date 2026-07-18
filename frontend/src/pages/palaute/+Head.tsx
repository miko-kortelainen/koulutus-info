const description = "Anna palautetta tai kehitysehdotus yhteishaku.app-palvelusta.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/palaute/" rel="canonical" />
      <meta content="https://yhteishaku.app/palaute/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
