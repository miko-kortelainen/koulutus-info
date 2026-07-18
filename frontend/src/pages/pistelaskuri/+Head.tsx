import { cutoffRoundYear, DEFAULT_CUTOFF_ROUND } from "@/config/cutoffRounds";

const description = `Laske YO- tai AMM-todistuspisteet ja vertaa tulosta vuoden ${cutoffRoundYear(
  DEFAULT_CUTOFF_ROUND,
)} suuntaa-antaviin AMK-pisterajoihin.`;

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/pistelaskuri/" rel="canonical" />
      <meta content="https://yhteishaku.app/pistelaskuri/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
