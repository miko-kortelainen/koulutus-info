import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";

const description = `Vuoden ${DEFAULT_CUTOFF_YEAR} yhteishakujen pisterajat: AMK- ja yliopistokoulutusten alimmat hyväksytyt pisteet koulutusaloittain ja kouluittain.`;

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/pisterajat/" rel="canonical" />
      <meta content="https://yhteishaku.app/pisterajat/" property="og:url" />
      <meta content={description} property="og:description" />
    </>
  );
}
