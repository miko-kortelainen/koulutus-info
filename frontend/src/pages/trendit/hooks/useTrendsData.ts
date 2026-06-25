import { useMemo } from "react";
import type { StatisticsEntry } from "@/types.gen";

export interface TrendsData {
  topKoulutusalat: { name: string; value: number }[];
  topKorkeakoulut: { name: string; value: number }[];
  sektoriData: { name: string; value: number }[];
}

export default function useTrendsData(data: StatisticsEntry[] | undefined): TrendsData {
  return useMemo(() => {
    const items = data ?? [];

    const aggregate = (key: keyof StatisticsEntry, topN?: number) => {
      const map = new Map<string, number>();
      for (const item of items) {
        const k = item[key] as string | undefined;
        if (!k) continue;
        map.set(k, (map.get(k) ?? 0) + item.ensisijaisetHakijatLkm);
      }
      const sorted = Array.from(map.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
      return topN ? sorted.slice(0, topN) : sorted;
    };

    return {
      topKoulutusalat: aggregate("koulutusalaTaso1", 10),
      topKorkeakoulut: aggregate("korkeakoulu", 10),
      sektoriData: aggregate("sektori"),
    };
  }, [data]);
}
