const description = "Korkeakoulujen ja toisen asteen yhteishaun hakuaikataulut vuonna 2027.";

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
