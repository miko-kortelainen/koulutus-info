import type { PageContextServer } from "vike/types";
import { type StudentFeedbackEntry, feedbackSchoolNames, readStudentFeedback } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export type FeedbackPageData = StudentFeedbackEntry & { schoolName: string };

export const data = (pageContext: PageContextServer): FeedbackPageData => {
  const { slug } = pageContext.routeParams;
  const schoolName = feedbackSchoolNames().find((name) => slugify(name) === slug);
  if (!schoolName) throw new Error(`No student feedback for school slug: ${slug}`);
  return { schoolName, ...readStudentFeedback()[schoolName] };
};
