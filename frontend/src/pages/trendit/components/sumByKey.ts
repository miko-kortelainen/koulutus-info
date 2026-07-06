import type { StatisticsEntry } from "@/types.gen";

export type SumKey = "koulutusalaTaso1" | "korkeakoulu" | "sektori";

export function sumByKey(items: StatisticsEntry[], key: SumKey): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = item[key];
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + item.ensisijaisetHakijatLkm);
  }
  return map;
}
