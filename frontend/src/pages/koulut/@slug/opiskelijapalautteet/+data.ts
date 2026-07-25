import type { PageContextServer } from "vike/types";
import type { UniversityFeedback } from "@/api/dataValidation";
import { feedbackSchoolNames, readUniversityFeedback, UNIVERSITY_FEEDBACK_YEAR } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export interface FeedbackPageData {
  schoolName: string;
  feedback: UniversityFeedback;
  feedbackYear: number;
}

export const data = (pageContext: PageContextServer): FeedbackPageData => {
  const { slug } = pageContext.routeParams;
  const schoolName = feedbackSchoolNames().find((name) => slugify(name) === slug);
  if (!schoolName) throw new Error(`No student feedback for school slug: ${slug}`);

  return {
    schoolName,
    feedback: readUniversityFeedback()[schoolName],
    feedbackYear: UNIVERSITY_FEEDBACK_YEAR,
  };
};
