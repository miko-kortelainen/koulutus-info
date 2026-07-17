import fs from "node:fs";
import {
  type CutoffRound,
  compareCutoffRounds,
  cutoffRoundFromFilename,
  DEFAULT_CUTOFF_ROUND,
} from "@/config/cutoffRounds";
import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import type { SchoolsResponse, StatisticsResponse } from "@/types.gen";
import { slugifySchoolName } from "../components/slug";
import { CURRENT_YEAR } from "../config/yearOptions";

interface CacheEntry {
  modifiedAt: number;
  data: unknown;
}

const cache = new Map<string, CacheEntry>();

const assertNoSlugCollisions = (names: string[], dataset: string) => {
  const slugToName = new Map<string, string>();
  for (const name of names) {
    const slug = slugifySchoolName(name);
    const existing = slugToName.get(slug);
    if (existing && existing !== name) {
      throw new Error(`${dataset} slug collision: "${name}" and "${existing}" both slugify to "${slug}"`);
    }
    slugToName.set(slug, name);
  }
};

export const readPublicData = (file: string) => {
  const path = `${process.cwd()}/public/data/${file}`;
  const modifiedAt = fs.statSync(path).mtimeMs;
  const cached = cache.get(file);
  if (cached?.modifiedAt === modifiedAt) return cached.data;

  const data = JSON.parse(fs.readFileSync(path, "utf-8"));
  cache.set(file, { modifiedAt, data });
  return data;
};

export const readCurrentYearStatistics = (): StatisticsResponse =>
  readPublicData(`hakijamaarat-${CURRENT_YEAR.replace("_", "-")}.json`);

export const availableCutoffRounds = (): CutoffRound[] =>
  fs
    .readdirSync(`${process.cwd()}/public/data`)
    .flatMap((filename) => cutoffRoundFromFilename(filename) ?? [])
    .sort(compareCutoffRounds);

export const readCutoffSchools = (round: CutoffRound = DEFAULT_CUTOFF_ROUND): CutoffSchool[] =>
  readPublicData(`pisterajat-${round}.json`);

export const cutoffSchoolNames = (): string[] => {
  const names = [...new Set(readCutoffSchools().map((school) => school.name))].sort();
  assertNoSlugCollisions(names, "Cutoff school");

  const schoolNameSet = new Set(schoolNames());
  const unknownSchools = names.filter((name) => !schoolNameSet.has(name));
  if (unknownSchools.length > 0) {
    throw new Error(`Cutoff schools missing from schools or statistics data: ${unknownSchools.join(", ")}`);
  }

  return names;
};

export const schoolNames = (): string[] => {
  const schools: SchoolsResponse = readPublicData("schools.json");
  const statistics: StatisticsResponse = readCurrentYearStatistics();
  const names = [
    ...schools.flatMap((k) => k.toteutukset.map((t) => t.oppilaitosNimi.fi)),
    ...statistics.map((s) => s.korkeakoulu),
  ].filter((n): n is string => Boolean(n));
  const uniqueNames = [...new Set(names)].sort();

  assertNoSlugCollisions(uniqueNames, "School");

  return uniqueNames;
};
