import fs from "fs";
import type { SchoolsResponse, StatisticsResponse } from "@/types.gen";

export const readPublicData = (file: string) =>
  JSON.parse(fs.readFileSync(`${process.cwd()}/public/data/${file}`, "utf-8"));

export const schoolNames = (): string[] => {
  const schools: SchoolsResponse = readPublicData("schools.json");
  // todo: allow changing year
  const statistics: StatisticsResponse = readPublicData("statistics-2026.json");
  const names = [
    ...schools.flatMap((k) => k.toteutukset.map((t) => t.oppilaitosNimi.fi)),
    ...statistics.map((s) => s.korkeakoulu),
  ].filter((n): n is string => Boolean(n));
  return [...new Set(names)].sort();
};
