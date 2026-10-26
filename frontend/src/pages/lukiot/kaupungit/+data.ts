import { lukioKuntaNames, readLukioKeskiarvot } from "@/api/serverData";

export interface LukioKunta {
  nimi: string;
  lukioidenMaara: number;
}

export const data = (): LukioKunta[] => {
  const entries = readLukioKeskiarvot();
  return lukioKuntaNames().map((nimi) => ({
    nimi,
    lukioidenMaara: new Set(entries.filter((entry) => entry.kunta === nimi).map((entry) => entry.koulu)).size,
  }));
};
