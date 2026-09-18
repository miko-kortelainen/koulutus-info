import type { PageContextServer } from "vike/types";
import {
  cutoffSchoolNames,
  feedbackSchoolNames,
  readAllProgramsWithAvailableCutoffs,
  readStatistics,
  resolveSchool,
} from "@/api/serverData";
import { CURRENT_YEAR, YEAR_OPTIONS, type YearOption } from "@/config/yearOptions";
import type { StatisticsEntry, ToteutusEntry } from "@/types.gen";

export interface SchoolPageData {
  schoolName: string;
  hasCutoffs: boolean;
  hasFeedback: boolean;
  toteutukset: ToteutusEntry[];
  statisticsYear: YearOption;
  statistics: StatisticsEntry[];
}

function schoolStatistics(schoolName: string, year: YearOption): StatisticsEntry[] {
  return readStatistics(year)
    .filter((entry) => entry.korkeakoulu === schoolName)
    .sort((a, b) => b.ensisijaisetHakijatLkm - a.ensisijaisetHakijatLkm);
}

function latestStatisticsYear(schoolName: string): YearOption {
  return (
    YEAR_OPTIONS.find(({ value }) => readStatistics(value).some((entry) => entry.korkeakoulu === schoolName))?.value ??
    CURRENT_YEAR
  );
}

export const data = (pageContext: PageContextServer): SchoolPageData => {
  const schoolName = resolveSchool(pageContext.routeParams.slug)?.name ?? "";
  const programs = readAllProgramsWithAvailableCutoffs();
  const statisticsYear = latestStatisticsYear(schoolName);
  const hasCutoffs = cutoffSchoolNames().includes(schoolName);
  return {
    schoolName,
    hasCutoffs,
    hasFeedback: feedbackSchoolNames().includes(schoolName),
    toteutukset: programs.flatMap((k) => k.toteutukset).filter((t) => t.oppilaitosNimi.fi === schoolName),
    statisticsYear,
    statistics: schoolStatistics(schoolName, statisticsYear),
  };
};
