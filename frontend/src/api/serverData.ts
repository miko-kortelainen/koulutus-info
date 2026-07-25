import fs from "node:fs";
import {
  type FeedbackMaxScore,
  parseCutoffSchools,
  parseSchools,
  parseStatistics,
  parseStudentFeedback,
  type StudentFeedback,
} from "@/api/dataValidation";
import {
  type CutoffRound,
  compareCutoffRounds,
  cutoffRoundFromFilename,
  DEFAULT_CUTOFF_ROUND,
} from "@/config/cutoffRounds";
import { CURRENT_YEAR, type YearOption } from "@/config/yearOptions";
import { filterUnavailableCutoffAlat } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";
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
    const slug = slugify(name);
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
  [
    ...new Set(
      fs
        .readdirSync(`${process.cwd()}/public/data/pisterajat`)
        .flatMap((filename) => cutoffRoundFromFilename(filename) ?? []),
    ),
  ].sort(compareCutoffRounds);

const cutoffSectors = ["amk", "yliopisto"] as const;

export const readCutoffSchools = (round: CutoffRound = DEFAULT_CUTOFF_ROUND): CutoffSchool[] =>
  cutoffSectors.flatMap((sector) =>
    readPublicData(`pisterajat/pisterajat-${round}-${sector}.json`, parseCutoffSchools),
  );

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

export type FeedbackSurvey = "avop" | "kandipalaute";

export interface StudentFeedbackEntry {
  feedback: StudentFeedback;
  maxScore: FeedbackMaxScore;
  survey: FeedbackSurvey;
  year: number;
}

export const readStudentFeedback = (): Record<string, StudentFeedbackEntry> => {
  const universityFeedback = readPublicData("yliopisto-palaute.json", (value, source) =>
    parseStudentFeedback(value, source, 5),
  );
  const amkFeedback = readPublicData("amk-palaute.json", (value, source) => parseStudentFeedback(value, source, 7));
  const duplicateSchools = Object.keys(universityFeedback).filter((name) => name in amkFeedback);
  if (duplicateSchools.length > 0) {
    throw new Error(`Student feedback schools found in both datasets: ${duplicateSchools.join(", ")}`);
  }

  const feedback: Record<string, StudentFeedbackEntry> = Object.fromEntries([
    ...Object.entries(universityFeedback).map(([name, schoolFeedback]) => [
      name,
      { feedback: schoolFeedback, maxScore: 5, survey: "kandipalaute", year: 2025 },
    ]),
    ...Object.entries(amkFeedback).map(([name, schoolFeedback]) => [
      name,
      { feedback: schoolFeedback, maxScore: 7, survey: "avop", year: 2025 },
    ]),
  ]);
  const knownSchoolNames = new Set(schoolNames());
  const unknownSchools = Object.keys(feedback).filter((name) => !knownSchoolNames.has(name));
  if (unknownSchools.length > 0) {
    throw new Error(`Student feedback schools missing from schools or statistics data: ${unknownSchools.join(", ")}`);
  }
  return feedback;
};

export const feedbackSchoolNames = (): string[] =>
  Object.keys(readStudentFeedback()).sort((a, b) => a.localeCompare(b, "fi"));
