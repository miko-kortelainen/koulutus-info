import { render } from "vike/abort";
import type { PageContextServer } from "vike/types";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import { lukioKuntaNames, readLukioKeskiarvot } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export interface LukioKuntaPageData {
  kunta: string;
  entries: LukioKeskiarvoEntry[];
}

export const data = (pageContext: PageContextServer): LukioKuntaPageData => {
  const kunta = lukioKuntaNames().find((name) => slugify(name) === pageContext.routeParams.kunta);
  if (!kunta) throw render(404);
  return { kunta, entries: readLukioKeskiarvot().filter((entry) => entry.kunta === kunta) };
};
