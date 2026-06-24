import favicon from "../../public/favicon.svg";

export function Head() {
  return (
    <>
      <link rel="icon" href={favicon} type="image/svg+xml" />
      <meta name="description" content="Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa." />
      <link rel="api-catalog" href="/.well-known/api-catalog" />
    </>
  );
}
