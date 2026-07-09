import { useMemo } from "react";
import type { StatisticsEntry } from "@/types.gen";
import { type SumKey, sumByKey } from "../components/sumByKey";

export interface TrendsData {
  topKoulutusalat: { name: string; value: number }[];
  topKorkeakoulut: { name: string; value: number }[];
  sektoriData: { name: string; value: number }[];
}

export default function useTrendsData(data: StatisticsEntry[] | undefined, limit = 10): TrendsData {
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
