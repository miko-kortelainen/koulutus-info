import { slugifySchoolName } from "@/components/slug";
import type { CutoffRound } from "@/config/cutoffRounds";
import type { Cutoff, Programme as CutoffProgramme } from "@/types/pisterajat.gen";

export interface CutoffWithRound extends Cutoff {
  round: CutoffRound;
}

export interface ProgrammeWithRounds extends Omit<CutoffProgramme, "cutoffs"> {
  cutoffs: CutoffWithRound[];
}

// Ala names can contain commas ("Kauppa, hallinto ja oikeustieteet"), so the ?ala= query
// param carries comma-separated slugs instead of display names.
export const alaSlugParam = (alat: string[]): string => alat.map(slugifySchoolName).join(",");

export const filterProgrammesByAlaParam = <T extends CutoffProgramme>(programmes: T[], alaParam: string): T[] => {
  const slugs = alaParam.split(",");
  return programmes.filter((programme) => slugs.includes(slugifySchoolName(programme.koulutusala)));
};

export const alaNamesForAlaParam = (programmes: CutoffProgramme[], alaParam: string): string[] => {
  const slugs = new Set(alaParam.split(","));
  const names = programmes.map((programme) => programme.koulutusala).filter((ala) => slugs.has(slugifySchoolName(ala)));
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, "fi"));
};

export interface CutoffEntry {
  programme: CutoffProgramme;
  round: CutoffRound;
}

// Merges the same programme across every cutoff round, tagging each cutoff with the round
// it was published in so pages can label and filter by yhteishaku rather than study-start term.
export const mergeCutoffProgrammes = (entries: CutoffEntry[]): ProgrammeWithRounds[] => {
  const merged = new Map<string, ProgrammeWithRounds>();
  for (const { programme, round } of entries) {
    const cutoffs = programme.cutoffs.map((cutoff) => ({ ...cutoff, round }));
    const existing = merged.get(programme.name);
    if (existing) {
      existing.cutoffs.push(...cutoffs);
    } else {
      merged.set(programme.name, { ...programme, cutoffs });
    }
  }
  return [...merged.values()];
};
