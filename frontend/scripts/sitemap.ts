import { writeFileSync } from "node:fs";
import { cutoffSchoolNames, schoolNames } from "../src/api/loadData";
import { slugifySchoolName } from "../src/components/slug";

const date = new Date().toISOString().split("T")[0];
const paths = [
  "/",
  "/hakijamaarat/",
  "/koulutukset/",
  "/pistelaskuri/",
  "/koulut/",
  "/trendit/",
  ...schoolNames().map((name) => `/koulut/${slugifySchoolName(name)}/`),
  ...cutoffSchoolNames().map((name) => `/koulut/${slugifySchoolName(name)}/pisterajat/`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path, i) => `  <url>
    <loc>https://yhteishaku.app${path}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${i === 0 ? "1.0" : "0.8"}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
