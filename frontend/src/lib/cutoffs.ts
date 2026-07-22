import { type CutoffRound, compareCutoffRounds } from "@/config/cutoffRounds";
import { slugify } from "@/lib/slug";
import type { Cutoff, Programme as CutoffProgramme, School as CutoffSchool } from "@/types/pisterajat.gen";
import type { SchoolsResponse } from "@/types.gen";

export interface CutoffWithRound extends Cutoff {
  round: CutoffRound;
}

export interface ProgrammeWithRounds extends Omit<CutoffProgramme, "cutoffs"> {
  cutoffs: CutoffWithRound[];
}

// Ala names can contain commas ("Kauppa, hallinto ja oikeustieteet"), so the ?ala= query
// param carries comma-separated slugs instead of display names.
export const alaSlugParam = (alat: string[]): string => alat.map(slugify).join(",");

export const filterProgrammesByAlaParam = <T extends CutoffProgramme>(programmes: T[], alaParam: string): T[] => {
  const slugs = alaParam.split(",");
  return programmes.filter((programme) => slugs.includes(slugify(programme.koulutusala)));
};

export const alaNamesForAlaParam = (programmes: CutoffProgramme[], alaParam: string): string[] => {
  const slugs = new Set(alaParam.split(","));
  const names = programmes.map((programme) => programme.koulutusala).filter((ala) => slugs.has(slugify(ala)));
  return [...new Set(names)].sort((a, b) => a.localeCompare(b, "fi"));
};

export const newestCutoffRoundForAlaParam = (
  programmes: ProgrammeWithRounds[],
  alaParam?: string,
): CutoffRound | undefined => {
  const scoped = alaParam ? filterProgrammesByAlaParam(programmes, alaParam) : programmes;
  return [...new Set(scoped.flatMap((programme) => programme.cutoffs.map((cutoff) => cutoff.round)))].sort(
    compareCutoffRounds,
  )[0];
};

export const filterUnavailableCutoffAlat = (
  schools: SchoolsResponse,
  cutoffSchools: CutoffSchool[],
): SchoolsResponse => {
  const availableAlat = new Map<string, Set<string>>();
  for (const school of cutoffSchools) {
    const alat = availableAlat.get(school.name) ?? new Set<string>();
    for (const programme of school.programmes) alat.add(programme.koulutusala);
    availableAlat.set(school.name, alat);
  }

  return schools.map((koulutus) => ({
    ...koulutus,
    toteutukset: koulutus.toteutukset.map((toteutus) => ({
      ...toteutus,
      koulutusalat: toteutus.koulutusalat?.filter((ala) =>
        availableAlat.get(toteutus.oppilaitosNimi.fi ?? "")?.has(ala),
      ),
    })),
  }));
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
