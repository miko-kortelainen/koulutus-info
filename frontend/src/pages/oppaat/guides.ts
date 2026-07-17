export interface GuideMeta {
  slug: string;
  title: string;
  /** Used for the index card, meta description and structured data */
  description: string;
  /** Lead paragraph shown under the title */
  lede: string;
  /** ISO date (e.g. "2026-07-17") — shown to readers and used in JSON-LD */
  updated: string;
  sources?: { label: string; href: string }[];
}

/**
 * Registry of all guides under /oppaat/. Adding a new guide:
 * 1. Add its metadata, lede and optional sources here.
 * 2. Add <slug>/content.mdx using plain `## Heading` lines for table-of-contents entries.
 * 3. Add a tiny <slug>/+Page.tsx importing content.mdx normally and with `?raw`, then pass both to GuideLayout.
 * 4. Add +config.ts (SEO title) and +Head.clear.tsx (<GuideHead slug="<slug>" />).
 *
 * Guide headings cannot contain Markdown/JSX, closing hashes or duplicate normalized IDs.
 */
export const guides: GuideMeta[] = [
  {
    slug: "yliopistojen-todistusvalinta",
    title: "Yliopistojen todistusvalinnan pisteytys",
    description:
      "Yliopistojen todistusvalinnan pisteytys vuodesta 2026: hyväksytyt tutkinnot, pisteytystaulukot, kynnysehdot ja vähimmäispisteet.",
    lede: "Todistusvalinnassa yliopisto laskee pisteet tutkintosi arvosanoista ja vertaa niitä muiden hakijoiden pisteisiin.",
    updated: "2026-07-17",
    sources: [
      {
        label: "Yliopistovalinnat.fi: Todistusvalinnan pisteytykset vuodesta 2026",
        href: "https://yliopistovalinnat.fi/todistusvalinnan-pisteytykset-vuodesta-2026",
      },
      {
        label: "Opintopolku: hakukohteiden valintaperusteet",
        href: "https://opintopolku.fi/konfo/fi/sivu/valmistaudu-korkeakoulujen-yhteishakuun",
      },
    ],
  },
];

export function getGuide(slug: string): GuideMeta {
  const meta = guides.find((guide) => guide.slug === slug);
  if (!meta) throw new Error(`Unknown guide slug "${slug}" — add it to guides.ts`);
  return meta;
}

/** "2026-07-17" → "17.7.2026" */
export function formatGuideDate(isoDate: string): string {
  return isoDate.split("-").reverse().map(Number).join(".");
}
