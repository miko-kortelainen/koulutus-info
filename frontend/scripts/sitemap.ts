import { writeFileSync } from "node:fs";
import { cutoffAlaNames, cutoffSchoolNames, schoolNames } from "../src/api/serverData";
import { slugify } from "../src/lib/slug";
import { guides } from "../src/pages/oppaat/guides";

const paths = [
  "/",
  "/hakijamaarat/",
  "/koulutukset/",
  "/pistelaskuri/",
  "/pisterajat/",
  ...cutoffAlaNames().map((name) => `/pisterajat/${slugify(name)}/`),
  "/oppaat/",
  ...guides.map((guide) => `/oppaat/${guide.slug}/`),
  "/koulut/",
  "/trendit/",
  "/vertaile/",
  "/ukk/",
  "/palaute/",
  "/tietosuojaseloste/",
  ...schoolNames().map((name) => `/koulut/${slugify(name)}/`),
  ...cutoffSchoolNames().map((name) => `/koulut/${slugify(name)}/pisterajat/`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path, i) => `  <url>
    <loc>https://yhteishaku.app${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${i === 0 ? "1.0" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
