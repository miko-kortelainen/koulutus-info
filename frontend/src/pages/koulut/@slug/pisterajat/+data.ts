import type { PageContextServer } from "vike/types";
import { type CutoffEntry, mergeCutoffProgrammes, type ProgrammeWithRounds } from "@/api/cutoffs";
import { availableCutoffRounds, readCutoffSchools } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";

export interface CutoffPageData {
  schoolName: string;
  programmes: ProgrammeWithRounds[];
}

export const data = (pageContext: PageContextServer): CutoffPageData => {
  const { slug } = pageContext.routeParams;
  let schoolName = "";
  const entries: CutoffEntry[] = [];

  for (const round of availableCutoffRounds()) {
    const school = readCutoffSchools(round).find((s) => slugifySchoolName(s.name) === slug);
    if (!school) continue;
    schoolName = school.name;
    for (const programme of school.programmes) {
      entries.push({ programme, round });
    }
  }

  return {
    schoolName,
    programmes: mergeCutoffProgrammes(entries),
  };
};
