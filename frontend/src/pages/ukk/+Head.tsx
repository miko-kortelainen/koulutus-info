import { QUESTIONS } from "./questions";

const description =
  "UKK Yhteishaku.app-sivustosta: datan lähteet Vipusesta ja Opintopolusta, hakijapaineen ja sisäänpääsyprosentin laskenta sekä tietojen päivittyminen.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: QUESTIONS.map(({ question, answerText }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answerText },
  })),
};

export function Head() {
  return (
    <>
      <meta content={description} name="description" />
      <link href="https://yhteishaku.app/ukk/" rel="canonical" />
      <meta content="https://yhteishaku.app/ukk/" property="og:url" />
      <meta content={description} property="og:description" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}
