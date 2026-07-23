import type { PageContextServer } from "vike/types";
import { availableCutoffRounds, readCutoffSchools } from "@/api/serverData";
import { type CutoffEntry, mergeCutoffProgrammes, type ProgrammeWithRounds } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";

export interface CutoffPageData {
  schoolName: string;
  programmes: ProgrammeWithRounds[];
}

export const data = (pageContext: PageContextServer): CutoffPageData => {
  const { slug } = pageContext.routeParams;
  let schoolName = "";
  const entries: CutoffEntry[] = [];

  for (const round of availableCutoffRounds()) {
    const schools = readCutoffSchools(round).filter((s) => slugify(s.name) === slug);
    for (const school of schools) {
      schoolName = school.name;
      for (const programme of school.programmes) {
        entries.push({ programme, round });
      }
    }
  }

  return {
    schoolName,
    programmes: mergeCutoffProgrammes(entries),
  };
};
