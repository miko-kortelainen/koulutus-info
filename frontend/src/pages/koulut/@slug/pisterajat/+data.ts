import type { PageContextServer } from "vike/types";
import { readCutoffSchools } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";
import type { Programme as CutoffProgramme } from "@/types/pisterajat.gen";

export interface CutoffPageData {
  schoolName: string;
  programmes: CutoffProgramme[];
}

export const data = (pageContext: PageContextServer): CutoffPageData => {
  const school = readCutoffSchools().find((s) => slugifySchoolName(s.name) === pageContext.routeParams.slug);

  return {
    schoolName: school?.name ?? "",
    programmes: school?.programmes ?? [],
  };
};
