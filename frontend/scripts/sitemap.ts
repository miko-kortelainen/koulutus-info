import { writeFileSync } from "node:fs";
import { cutoffSchoolNames, schoolNames } from "../src/api/loadData";
import { slugifySchoolName } from "../src/components/slug";
import { guides } from "../src/pages/oppaat/guides";

const paths = [
  "/",
  "/hakijamaarat/",
  "/koulutukset/",
  "/pistelaskuri/",
  "/oppaat/",
  ...guides.map((guide) => `/oppaat/${guide.slug}/`),
  "/koulut/",
  "/trendit/",
  "/vertaile/",
  "/ukk/",
  "/palaute/",
  "/tietosuojaseloste/",
  ...schoolNames().map((name) => `/koulut/${slugifySchoolName(name)}/`),
  ...cutoffSchoolNames().map((name) => `/koulut/${slugifySchoolName(name)}/pisterajat/`),
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
