import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";

const description = `Laske vuoden ${DEFAULT_CUTOFF_YEAR} yhteishaun yliopistojen ja AMK:ien todistusvalintapisteesi. Katso mihin pisteesi riittävät ja mitä kynnysehtoja aloilla on.`;

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/todistusvalintalaskuri/" rel="canonical" />
      <meta content="https://yhteishaku.app/todistusvalintalaskuri/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
