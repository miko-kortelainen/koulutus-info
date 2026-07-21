import type { PageContextServer } from "vike/types";
import { availableCutoffRounds, cutoffAlaNames, readCutoffSchools } from "@/api/serverData";
import { type CutoffEntry, mergeCutoffProgrammes, type ProgrammeWithRounds } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";

interface AlaSchool {
  name: string;
  slug: string;
  programmes: ProgrammeWithRounds[];
}

export interface AlaPageData {
  alaName: string;
  schools: AlaSchool[];
}

export const data = (pageContext: PageContextServer): AlaPageData => {
  const { ala } = pageContext.routeParams;
  const alaName = cutoffAlaNames().find((name) => slugify(name) === ala) ?? "";
  const bySchool = new Map<string, { name: string; slug: string; entries: CutoffEntry[] }>();

  for (const round of availableCutoffRounds()) {
    for (const school of readCutoffSchools(round)) {
      for (const programme of school.programmes) {
        if (programme.koulutusala !== alaName) continue;
        let entry = bySchool.get(school.name);
        if (!entry) {
          entry = { name: school.name, slug: slugify(school.name), entries: [] };
          bySchool.set(school.name, entry);
        }
        entry.entries.push({ programme, round });
      }
    }
  }

  const schools = [...bySchool.values()]
    .map(({ entries, ...school }) => ({
      ...school,
      programmes: mergeCutoffProgrammes(entries).sort((a, b) => a.name.localeCompare(b.name, "fi")),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fi"));

  return { alaName, schools };
};
