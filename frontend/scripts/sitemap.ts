import { readdirSync, statSync, writeFileSync } from "node:fs";
import { cutoffAlaNames, cutoffSchoolNames, feedbackSchoolNames, schoolNames } from "../src/api/serverData";
import { CURRENT_YEAR } from "../src/config/yearOptions";
import { slugify } from "../src/lib/slug";
import { guides } from "../src/pages/oppaat/guides";

const latestModifiedDate = (files: string[]): string | undefined => {
  if (files.length === 0) return undefined;
  return new Date(Math.max(...files.map((file) => statSync(`public/data/${file}`).mtimeMs))).toISOString().slice(0, 10);
};

const cutoffFiles = readdirSync("public/data/pisterajat").map((file) => `pisterajat/${file}`);
const currentStatisticsFile = `hakijamäärät/hakijamaarat-${CURRENT_YEAR.replace("_", "-")}.json`;
const feedbackFiles = ["amk-palaute.json", "yliopisto-palaute.json"];
const cutoffsLastmod = latestModifiedDate(cutoffFiles);
const feedbackLastmod = latestModifiedDate(feedbackFiles);
const statisticsLastmod = latestModifiedDate([currentStatisticsFile]);
const programmesLastmod = latestModifiedDate(["schools.json", ...cutoffFiles]);
const schoolsLastmod = latestModifiedDate([
  "schools.json",
  currentStatisticsFile,
  ...cutoffFiles,
  ...feedbackFiles,
]);

const hubPaths = new Set(["/pistelaskuri/", "/pisterajat/", "/hakijamaarat/", "/koulutukset/", "/oppaat/"]);
const utilityPaths = new Set(["/asenna/", "/tietosuojaseloste/"]);
const guideLastmods = new Map(guides.map((guide) => [`/oppaat/${guide.slug}/`, guide.updated]));

const priorityFor = (path: string) => {
  if (path === "/") return "1.0";
  if (hubPaths.has(path)) return "0.9";
  if (utilityPaths.has(path)) return "0.4";
  if (path === "/ukk/" || path === "/ennakointi/") return "0.6";
  if ((path.startsWith("/koulut/") && path !== "/koulut/") || path.startsWith("/pisterajat/")) return "0.7";
  return "0.8";
};

const lastmodFor = (path: string) => {
  if (path === "/hakijamaarat/" || path === "/trendit/") return statisticsLastmod;
  if (path === "/koulutukset/") return programmesLastmod;
  if (path.endsWith("/opiskelijapalautteet/")) return feedbackLastmod;
  if (path === "/pistelaskuri/" || path.startsWith("/pisterajat/") || path.endsWith("/pisterajat/")) {
    return cutoffsLastmod;
  }
  if (path === "/koulut/" || path.startsWith("/koulut/")) return schoolsLastmod;
  if (path === "/ennakointi/") {
    return latestModifiedDate(["ennakointi/koulutustarpeet.json"]);
  }
  return guideLastmods.get(path);
};

const paths = [
  "/",
  "/asenna/",
  "/hakijamaarat/",
  "/koulutukset/",
  "/pistelaskuri/",
  "/pisterajat/",
  ...cutoffAlaNames().map((name) => `/pisterajat/${slugify(name)}/`),
  "/oppaat/",
  ...guides.map((guide) => `/oppaat/${guide.slug}/`),
  "/koulut/",
  "/trendit/",
  "/ukk/",
  "/ennakointi/",
  "/tietosuojaseloste/",
  ...schoolNames().map((name) => `/koulut/${slugify(name)}/`),
  ...cutoffSchoolNames().map((name) => `/koulut/${slugify(name)}/pisterajat/`),
  ...feedbackSchoolNames().map((name) => `/koulut/${slugify(name)}/opiskelijapalautteet/`),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map((path) => {
    const lastmod = lastmodFor(path);
    return `  <url>
    <loc>https://yhteishaku.app${path}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>weekly</changefreq>
    <priority>${priorityFor(path)}</priority>
  </url>`;
  })
  .join("\n")}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
