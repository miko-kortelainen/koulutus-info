import { useMemo } from "react";
import type { StatisticsEntry } from "@/types.gen";

type SumKey = "koulutusalaTaso1" | "korkeakoulu" | "sektori";

function sumByKey(items: StatisticsEntry[], key: SumKey): Map<string, number> {
  const map = new Map<string, number>();
  for (const item of items) {
    const k = item[key];
    if (!k) continue;
    map.set(k, (map.get(k) ?? 0) + item.ensisijaisetHakijatLkm);
  }
  return map;
}

export default function useTrendsData(data: StatisticsEntry[] | undefined, limit = 10) {
  return useMemo(() => {
    const items = data ?? [];

    const aggregate = (key: SumKey, topN?: number) => {
      const sorted = Array.from(sumByKey(items, key).entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      return topN ? sorted.slice(0, topN) : sorted;
    };

    return {
      topKoulutusalat: aggregate("koulutusalaTaso1", limit > 0 ? limit : undefined),
      topKorkeakoulut: aggregate("korkeakoulu", limit > 0 ? limit : undefined),
      sektoriData: aggregate("sektori"),
    };
  }, [data, limit]);
}
