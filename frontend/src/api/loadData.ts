import fs from "node:fs";
import { filterUnavailableCutoffAlat } from "@/api/cutoffs";
import { parseCutoffSchools, parseSchools, parseStatistics } from "@/api/dataValidation";
import { slugifySchoolName } from "@/components/slug";
import {
  type CutoffRound,
  compareCutoffRounds,
  cutoffRoundFromFilename,
  DEFAULT_CUTOFF_ROUND,
} from "@/config/cutoffRounds";
import { CURRENT_YEAR, type YearOption } from "@/config/yearOptions";
import type { School as CutoffSchool } from "@/types/pisterajat.gen";
import type { SchoolsResponse, StatisticsResponse } from "@/types.gen";

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

const readPublicData = <T>(file: string, parse: (value: unknown, source: string) => T): T => {
  const path = `${process.cwd()}/public/data/${file}`;
  const modifiedAt = fs.statSync(path).mtimeMs;
  const cached = cache.get(file);
  if (cached?.modifiedAt === modifiedAt) return cached.data as T;

  const data = parse(JSON.parse(fs.readFileSync(path, "utf-8")), file);
  cache.set(file, { modifiedAt, data });
  return data;
};

export const readStatistics = (round: YearOption): StatisticsResponse =>
  readPublicData(`hakijamaarat-${round.replace("_", "-")}.json`, parseStatistics);

export const readCurrentYearStatistics = (): StatisticsResponse => readStatistics(CURRENT_YEAR);

export const readSchools = (): SchoolsResponse => readPublicData("schools.json", parseSchools);

export const availableCutoffRounds = (): CutoffRound[] =>
  fs
    .readdirSync(`${process.cwd()}/public/data`)
    .flatMap((filename) => cutoffRoundFromFilename(filename) ?? [])
    .sort(compareCutoffRounds);

export const readCutoffSchools = (round: CutoffRound = DEFAULT_CUTOFF_ROUND): CutoffSchool[] =>
  readPublicData(`pisterajat-${round}.json`, parseCutoffSchools);

export const readSchoolsWithAvailableCutoffs = (): SchoolsResponse =>
  filterUnavailableCutoffAlat(
    readSchools(),
    availableCutoffRounds().flatMap((round) => readCutoffSchools(round)),
  );

export const cutoffSchoolNames = (): string[] => {
  const names = [
    ...new Set(availableCutoffRounds().flatMap((round) => readCutoffSchools(round).map((school) => school.name))),
  ].sort((a, b) => a.localeCompare(b, "fi"));
  assertNoSlugCollisions(names, "Cutoff school");

  const schoolNameSet = new Set(schoolNames());
  const unknownSchools = names.filter((name) => !schoolNameSet.has(name));
  if (unknownSchools.length > 0) {
    throw new Error(`Cutoff schools missing from schools or statistics data: ${unknownSchools.join(", ")}`);
  }

  return names;
};

export const cutoffAlaNames = (): string[] => {
  const names = availableCutoffRounds().flatMap((round) =>
    readCutoffSchools(round).flatMap((school) => school.programmes.map((programme) => programme.koulutusala)),
  );
  const sorted = [...new Set(names)].filter(Boolean).sort((a, b) => a.localeCompare(b, "fi"));
  assertNoSlugCollisions(sorted, "Koulutusala");
  return sorted;
};

export const schoolNames = (): string[] => {
  const schools = readSchools();
  const statistics = readCurrentYearStatistics();
  const names = [
    ...schools.flatMap((k) => k.toteutukset.map((t) => t.oppilaitosNimi.fi)),
    ...statistics.map((s) => s.korkeakoulu),
  ].filter((n): n is string => Boolean(n));
  const uniqueNames = [...new Set(names)].sort((a, b) => a.localeCompare(b, "fi"));

  assertNoSlugCollisions(uniqueNames, "School");

  return uniqueNames;
};
