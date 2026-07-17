import { Head as GlobalHead } from "../+Head";
import { getGuide } from "./guides";

/**
 * Shared <head> for guide subpages: global tags + description/canonical/og
 * + Article and BreadcrumbList structured data. Usage in +Head.clear.tsx:
 *   export function Head() {
 *     return <GuideHead slug="my-guide" />;
 *   }
 */
export function GuideHead({ slug }: { slug: string }) {
  const meta = getGuide(slug);
  const url = `https://yhteishaku.app/oppaat/${meta.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        inLanguage: "fi",
        mainEntityOfPage: url,
        datePublished: meta.updated,
        dateModified: meta.updated,
        publisher: {
          "@type": "Organization",
          name: "Yhteishaku.app",
          url: "https://yhteishaku.app/",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Yhteishaku.app", item: "https://yhteishaku.app/" },
          { "@type": "ListItem", position: 2, name: "Oppaat", item: "https://yhteishaku.app/oppaat/" },
          { "@type": "ListItem", position: 3, name: meta.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <GlobalHead />
      <meta content={meta.description} name="description" />
      <link href={url} rel="canonical" />
      <meta content={url} property="og:url" />
      <meta content={meta.description} property="og:description" />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </>
  );
}
