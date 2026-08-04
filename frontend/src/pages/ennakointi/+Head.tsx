const description =
  "Katso mille aloille on ennusteen mukaan eniten pulaa valmistuneista. Vertaa AMK- ja yliopistoalojen koulutustarvetta ja tutkintotuotosta vuoteen 2045.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/ennakointi/" rel="canonical" />
      <meta content="https://yhteishaku.app/ennakointi/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
