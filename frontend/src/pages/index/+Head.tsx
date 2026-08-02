import { CURRENT_YEAR } from "@/config/yearOptions";

const description = `Korkeakoulujen yhteishaku ${CURRENT_YEAR.slice(
  0,
  4,
)}: hakuajat, koulutukset, hakijamäärät, pisterajat ja todistusvalintalaskuri.`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://yhteishaku.app/#organization",
      name: "Yhteishaku.app",
      url: "https://yhteishaku.app/",
    },
    {
      "@type": "WebSite",
      "@id": "https://yhteishaku.app/#website",
      name: "Yhteishaku.app",
      url: "https://yhteishaku.app/",
      inLanguage: "fi",
      publisher: { "@id": "https://yhteishaku.app/#organization" },
    },
  ],
};

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/" rel="canonical" />
      <meta content="https://yhteishaku.app/" property="og:url" />
      <meta content={description} property="og:description" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}
