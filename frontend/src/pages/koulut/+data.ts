import type { FeedbackMaxScore } from "@/api/dataValidation";
import { readStatistics, readStudentFeedback, schoolNames } from "@/api/serverData";
import { DEFAULT_SCHOOL_LIST_YEAR, YEAR_OPTIONS } from "@/config/yearOptions";
import { slugify } from "@/lib/slug";
import { schoolStatisticTotals } from "@/pages/koulut/lib/applyYearStatistics";

export interface SchoolListItem {
  name: string;
  slug: string;
  sektori: string;
  kaikkiHakijat: number | null;
  valitut: number | null;
  ensisijaisetHakijat: number | null;
  aloituspaikat: number | null;
  feedbackAverage: number | null;
  feedbackMaxScore: FeedbackMaxScore | null;
}

export const data = (): SchoolListItem[] => {
  const statistics = readStatistics(DEFAULT_SCHOOL_LIST_YEAR);
  const feedback = readStudentFeedback();
  // Autumn current rounds omit most universities; sector still comes from earlier statistics.
  const sektori = new Map(
    YEAR_OPTIONS.flatMap(({ value }) => readStatistics(value).map((r) => [r.korkeakoulu, r.sektori] as const)),
  );
  return schoolNames().map((name) => {
    const schoolFeedback = feedback[name];
    return {
      name,
      slug: slugify(name),
      sektori: sektori.get(name) ?? "",
      ...schoolStatisticTotals(statistics.filter((s) => s.korkeakoulu === name)),
      feedbackAverage: schoolFeedback?.feedback.tilastot.keskiarvo ?? null,
      feedbackMaxScore: schoolFeedback?.maxScore ?? null,
    };
  });
};
