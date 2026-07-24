import type { PageContextServer } from "vike/types";
import type { UniversityFeedback } from "@/api/dataValidation";
import {
  cutoffSchoolNames,
  readCurrentYearStatistics,
  readSchoolsWithAvailableCutoffs,
  readUniversityFeedback,
  schoolNames,
  UNIVERSITY_FEEDBACK_YEAR,
} from "@/api/serverData";
import { slugify } from "@/lib/slug";
import type { StatisticsEntry, ToteutusEntry } from "@/types.gen";

export interface SchoolPageData {
  schoolName: string;
  hasCutoffs: boolean;
  toteutukset: ToteutusEntry[];
  statistics: StatisticsEntry[];
  feedback: UniversityFeedback | null;
  feedbackYear: number | null;
}

export const data = (pageContext: PageContextServer): SchoolPageData => {
  const schoolName = schoolNames().find((name) => slugify(name) === pageContext.routeParams.slug) ?? "";
  const schools = readSchoolsWithAvailableCutoffs();
  const statistics = readCurrentYearStatistics();
  const feedback = readUniversityFeedback()[schoolName] ?? null;
  const hasCutoffs = cutoffSchoolNames().includes(schoolName);
  return {
    schoolName,
    hasCutoffs,
    toteutukset: schools.flatMap((k) => k.toteutukset).filter((t) => t.oppilaitosNimi.fi === schoolName),
    statistics: statistics
      .filter((s) => s.korkeakoulu === schoolName)
      .sort((a, b) => b.ensisijaisetHakijatLkm - a.ensisijaisetHakijatLkm),
    feedback,
    feedbackYear: feedback ? UNIVERSITY_FEEDBACK_YEAR : null,
  };
};
