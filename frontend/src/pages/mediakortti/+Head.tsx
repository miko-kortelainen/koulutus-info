const description = "Mainostajille ja sponsoreille: Yhteishaku.app-sivuston kävijämäärät, yleisö ja mainosyhteistyö.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <meta content="noindex, follow" name="robots" />
      <link href="https://yhteishaku.app/mediakortti/" rel="canonical" />
      <meta content="https://yhteishaku.app/mediakortti/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
