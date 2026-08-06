import type { PageContextServer } from "vike/types";
import {
  cutoffSchoolNames,
  feedbackSchoolNames,
  readCurrentProgramsWithAvailableCutoffs,
  readCurrentYearStatistics,
  resolveSchool,
} from "@/api/serverData";
import type { StatisticsEntry, ToteutusEntry } from "@/types.gen";

export interface SchoolPageData {
  schoolName: string;
  hasCutoffs: boolean;
  hasFeedback: boolean;
  toteutukset: ToteutusEntry[];
  statistics: StatisticsEntry[];
}

export const data = (pageContext: PageContextServer): SchoolPageData => {
  const schoolName = resolveSchool(pageContext.routeParams.slug)?.name ?? "";
  const programs = readCurrentProgramsWithAvailableCutoffs();
  const statistics = readCurrentYearStatistics();
  const hasCutoffs = cutoffSchoolNames().includes(schoolName);
  return {
    schoolName,
    hasCutoffs,
    hasFeedback: feedbackSchoolNames().includes(schoolName),
    toteutukset: programs.flatMap((k) => k.toteutukset).filter((t) => t.oppilaitosNimi.fi === schoolName),
    statistics: statistics
      .filter((s) => s.korkeakoulu === schoolName)
      .sort((a, b) => b.ensisijaisetHakijatLkm - a.ensisijaisetHakijatLkm),
  };
};
