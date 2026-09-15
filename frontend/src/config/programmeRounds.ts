import { CURRENT_PROGRAMME_ROUND, PROGRAMME_ROUNDS } from "@/generated/dataManifest";

export type ProgrammeRound = (typeof PROGRAMME_ROUNDS)[number];
export { CURRENT_PROGRAMME_ROUND, PROGRAMME_ROUNDS };

const KESET_INESSIVE: Record<string, string> = {
  "1": "ensimmäisessä",
  "2": "toisessa",
};

export function programmeRoundLabel(round: ProgrammeRound) {
  const [year, season, wave] = round.split("_");
  if (season === "syksy") {
    return `Syksyn yhteishaku ${year}`;
  }
  return wave ? `Kevään ${wave}. yhteishaku ${year}` : `Kevään yhteishaku ${year}`;
}

export function programmeRoundIntro(round: ProgrammeRound) {
  const [year, season, wave] = round.split("_");
  if (season === "syksy") {
    return `Korkeakoulujen syksyn ${year} yhteishaussa olevat toteutukset.`;
  }
  const ordinal = wave ? KESET_INESSIVE[wave] : undefined;
  if (ordinal) {
    return `Korkeakoulujen kevään ${year} ${ordinal} yhteishaussa olevat toteutukset.`;
  }
  return `Korkeakoulujen kevään ${year} yhteishaussa olevat toteutukset.`;
}

export const PROGRAMME_ROUND_OPTIONS = PROGRAMME_ROUNDS.map((round) => ({
  label: programmeRoundLabel(round),
  value: round,
}));
