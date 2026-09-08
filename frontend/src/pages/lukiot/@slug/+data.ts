import type { PageContextServer } from "vike/types";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import { readLukioKeskiarvotForSchool, resolveLukioSchool } from "@/api/serverData";

export interface LukioSchoolPageData {
  schoolName: string;
  entries: LukioKeskiarvoEntry[];
}

export const data = (pageContext: PageContextServer): LukioSchoolPageData => {
  const schoolName = resolveLukioSchool(pageContext.routeParams.slug) ?? "";
  return {
    schoolName,
    entries: schoolName ? readLukioKeskiarvotForSchool(schoolName) : [],
  };
};
