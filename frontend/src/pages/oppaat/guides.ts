export interface GuideMeta {
  slug: string;
  title: string;
  /** Used for the index card, meta description and structured data */
  description: string;
  /** Lead paragraph shown under the title */
  lede: string;
  /** "Pähkinänkuoressa" bullets shown before the table of contents — keep to 2–3 short points */
  tldr: string[];
  /** ISO date (e.g. "2026-07-17") — shown to readers and used in JSON-LD */
  updated: string;
  sources?: { label: string; href: string }[];
}

/**
 * Registry of all guides under /oppaat/. Adding a new guide:
 * 1. Add its metadata, lede, tldr bullets and optional sources here.
 * 2. Add <slug>/content.mdx using plain `## Heading` lines for table-of-contents entries.
 * 3. Add a tiny <slug>/+Page.tsx importing content.mdx normally and with `?raw`, then pass both to GuideLayout.
 * 4. Add +config.ts (SEO title) and +Head.clear.tsx (<GuideHead slug="<slug>" />).
 *
 * Guide headings cannot contain Markdown/JSX, closing hashes or duplicate normalized IDs.
 */
export const guides: GuideMeta[] = [
  {
    slug: "ammattikorkeakoulujen-todistusvalinta",
    title: "Ammattikorkeakoulujen todistusvalinnan pisteytys",
    description:
      "Ylioppilastutkinnon ja ammatillisen perustutkinnon pisteytys ammattikorkeakoulujen todistusvalinnassa vuonna 2026: valintajonot, vähimmäispisteet ja kynnysehdot.",
    lede: "Ammattikorkeakoulut pisteyttävät ylioppilastutkinnon ja ammatillisen perustutkinnon eri pisteytysmalleilla, ja tutkinnoille on omat valintajononsa.",
    tldr: [
      "Ylioppilastutkinnosta voi saada enintään 198 pistettä ja ammatillisesta perustutkinnosta 150 pistettä.",
      "Jos sinulla on molemmat todistusvalintaan kelpaavat tutkinnot, sinut huomioidaan automaattisesti molemmissa valintajonoissa.",
      "Hakukohde voi asettaa vähimmäispistemäärän tai kynnysehdon.",
    ],
    updated: "2026-07-22",
    sources: [
      {
        label: "Ammattikorkeakouluun.fi: Todistusvalinta",
        href: "https://www.ammattikorkeakouluun.fi/hakijalle/valintatavat/todistusvalinta/",
      },
    ],
  },
  {
    slug: "yliopistojen-todistusvalinta",
    title: "Yliopistojen todistusvalintojen pisteytys ja kynnysehdot",
    description:
      "Suomalaisen ylioppilastutkinnon pisteytys yliopistojen todistusvalinnassa vuodesta 2026: pisteytystaulukot, kynnysehdot ja vähimmäispisteet.",
    lede: "Yliopisto laskee todistusvalinnan pisteet ylioppilastutkintosi arvosanoista ja enimmäispisteet vaihtelee alasta riippuen.",
    tldr: [
      "Pisteesi lasketaan ylioppilastutkintosi arvosanoista.",
      "Pisteytys, kynnysehdot ja enimmäispisteet riippuvat siitä mitä pisteytystaulukkoa käytetään.",
      "Vuodesta 2026 alkaen käytössä on 11 pisteytystaulukkoa.",
      "Kynnysehdot ovat usein alakohtaisia",
    ],
    updated: "2026-07-18",
    sources: [
      {
        label: "Yliopistovalinnat.fi: Todistusvalinnan pisteytykset vuodesta 2026",
        href: "https://yliopistovalinnat.fi/todistusvalinnan-pisteytykset-vuodesta-2026",
      },
      {
        label: "Opintopolku: hakukohteiden valintaperusteet",
        href: "https://opintopolku.fi/konfo/fi/sivu/valmistaudu-korkeakoulujen-yhteishakuun",
      },
      {
        label: "Opetushallitus: Suomalaisen lukion voi suorittaa englanniksi syksystä 2026 alkaen",
        href: "https://www.oph.fi/fi/uutiset/2025/suomalaisen-lukion-voi-suorittaa-englanniksi-syksysta-2026-alkaen",
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
