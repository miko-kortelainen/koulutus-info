import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";

const description = `Laske vuoden ${DEFAULT_CUTOFF_YEAR} YO- tai ammatillisen perustutkinnon todistusvalintapisteet ja vertaa tulosta korkeakoulujen pisterajoihin.`;

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
