import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import { readLukioKeskiarvotForSchool, resolveLukioSchool } from "@/api/serverData";

export interface LukioSchoolPageData {
  schoolName: string;
  entries: LukioKeskiarvoEntry[];
}

export const data = (pageContext: PageContextServer): LukioSchoolPageData => {
  const schoolName = resolveLukioSchool(pageContext.routeParams.slug);
  if (!schoolName) {
    throw render(404);
  }

  return {
    schoolName,
    entries: readLukioKeskiarvotForSchool(schoolName),
  };
};
