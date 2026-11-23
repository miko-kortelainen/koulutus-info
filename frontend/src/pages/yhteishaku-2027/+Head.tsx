const description =
  "Yhteishaku 2027: korkeakoulujen kevään ja syksyn yhteishakujen sekä toisen asteen yhteishaun hakuajat, tulosten julkaisu ja paikan vastaanoton määräajat.";

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/yhteishaku-2027/" rel="canonical" />
      <meta content="https://yhteishaku.app/yhteishaku-2027/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
