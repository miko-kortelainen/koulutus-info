import type { PageContextServer } from "vike/types";
import { readCurrentYearStatistics, readCutoffSchools, readSchools, schoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";
import type { StatisticsEntry, ToteutusEntry } from "@/types.gen";

export interface SchoolPageData {
  schoolName: string;
  hasCutoffs: boolean;
  toteutukset: ToteutusEntry[];
  statistics: StatisticsEntry[];
}

export const data = (pageContext: PageContextServer): SchoolPageData => {
  const schoolName = schoolNames().find((name) => slugifySchoolName(name) === pageContext.routeParams.slug) ?? "";
  const schools = readSchools();
  const statistics = readCurrentYearStatistics();
  const hasCutoffs = readCutoffSchools().some((school) => school.name === schoolName);
  return {
    schoolName,
    hasCutoffs,
    toteutukset: schools.flatMap((k) => k.toteutukset).filter((t) => t.oppilaitosNimi.fi === schoolName),
    statistics: statistics
      .filter((s) => s.korkeakoulu === schoolName)
      .sort((a, b) => b.ensisijaisetHakijatLkm - a.ensisijaisetHakijatLkm),
  };
};
