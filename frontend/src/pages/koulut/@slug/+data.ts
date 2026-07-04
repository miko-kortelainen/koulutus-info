import { readPublicData, schoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";
import type { PageContextServer } from "vike/types";
import type { SchoolsResponse, StatisticsEntry, StatisticsResponse, ToteutusEntry } from "@/types.gen";

export interface SchoolPageData {
  schoolName: string;
  toteutukset: ToteutusEntry[];
  statistics: StatisticsEntry[];
}

export const data = (pageContext: PageContextServer): SchoolPageData => {
  const schoolName = schoolNames().find((name) => slugifySchoolName(name) === pageContext.routeParams.slug) ?? "";
  const schools: SchoolsResponse = readPublicData("schools.json");
  const statistics: StatisticsResponse = readPublicData("statistics-2026.json");
  return {
    schoolName,
    toteutukset: schools.flatMap((k) => k.toteutukset).filter((t) => t.oppilaitosNimi.fi === schoolName),
    statistics: statistics
      .filter((s) => s.korkeakoulu === schoolName)
      .sort((a, b) => b.ensisijaisetHakijatLkm - a.ensisijaisetHakijatLkm),
  };
};
