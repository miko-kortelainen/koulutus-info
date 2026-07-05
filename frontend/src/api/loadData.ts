import fs from "fs";
import { slugifySchoolName } from "../components/slug";
import { YEAR_OPTIONS } from "../pages/hakijamaarat/components/yearOptions";
import type { SchoolsResponse, StatisticsResponse } from "@/types.gen";

export const CURRENT_YEAR = YEAR_OPTIONS[0].value;

const cache = new Map<string, unknown>();

export const readPublicData = (file: string) => {
  if (cache.has(file)) return cache.get(file);
  const data = JSON.parse(fs.readFileSync(`${process.cwd()}/public/data/${file}`, "utf-8"));
  cache.set(file, data);
  return data;
};

export const readCurrentYearStatistics = (): StatisticsResponse => readPublicData(`statistics-${CURRENT_YEAR}.json`);

export const schoolNames = (): string[] => {
  const schools: SchoolsResponse = readPublicData("schools.json");
  const statistics: StatisticsResponse = readCurrentYearStatistics();
  const names = [
    ...schools.flatMap((k) => k.toteutukset.map((t) => t.oppilaitosNimi.fi)),
    ...statistics.map((s) => s.korkeakoulu),
  ].filter((n): n is string => Boolean(n));
  const uniqueNames = [...new Set(names)].sort();

  // Build-time invariant check: two different school names must never collapse to the
  // same slug, since the slug is the only thing that identifies a school's page/route.
  const slugToName = new Map<string, string>();
  for (const name of uniqueNames) {
    const slug = slugifySchoolName(name);
    const existing = slugToName.get(slug);
    if (existing && existing !== name) {
      throw new Error(`Slug collision: "${name}" and "${existing}" both slugify to "${slug}"`);
    }
    slugToName.set(slug, name);
  }

  return uniqueNames;
};
