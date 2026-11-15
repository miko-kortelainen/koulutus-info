import type { PageContextServer } from "vike/types";
import { availableCutoffRounds, cutoffAlaNames, readCutoffSchools } from "@/api/serverData";
import type { CutoffRound } from "@/config/cutoffRounds";
import { type CutoffEntry, mergeCutoffProgrammes, type ProgrammeWithRounds } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";

export interface AlaProgramme extends ProgrammeWithRounds {
  schoolName: string;
}

export interface AlaPageData {
  alaName: string;
  rounds: CutoffRound[];
  programmes: AlaProgramme[];
}

export const data = (pageContext: PageContextServer): AlaPageData => {
  const { ala } = pageContext.routeParams;
  const alaName = cutoffAlaNames().find((name) => slugify(name) === ala) ?? "";
  const rounds = availableCutoffRounds();
  const bySchool = new Map<string, CutoffEntry[]>();

  for (const round of rounds) {
    for (const school of readCutoffSchools(round)) {
      for (const programme of school.programmes) {
        if (programme.koulutusala !== alaName) continue;
        const entries = bySchool.get(school.name) ?? [];
        entries.push({ programme, round });
        bySchool.set(school.name, entries);
      }
    }
  }

  const programmes = [...bySchool.entries()]
    .flatMap(([schoolName, entries]) =>
      mergeCutoffProgrammes(entries).map((programme) => ({ ...programme, schoolName })),
    )
    .sort((a, b) => a.name.localeCompare(b.name, "fi") || a.schoolName.localeCompare(b.schoolName, "fi"));

  return { alaName, rounds, programmes };
};
