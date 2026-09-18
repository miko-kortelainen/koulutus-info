import type { SchoolListItem } from "@/pages/koulut/+data";
import type { StatisticsEntry, StatisticsResponse } from "@/types.gen";

export function schoolStatisticTotals(rows: StatisticsEntry[]) {
  if (rows.length === 0) {
    return {
      kaikkiHakijat: null,
      valitut: null,
      ensisijaisetHakijat: null,
      aloituspaikat: null,
    };
  }

  return {
    kaikkiHakijat: rows.reduce((sum, row) => sum + row.kaikkiHakijatLkm, 0),
    valitut: rows.reduce((sum, row) => sum + row.valitutLkm, 0),
    ensisijaisetHakijat: rows.reduce((sum, row) => sum + row.ensisijaisetHakijatLkm, 0),
    aloituspaikat: rows.reduce((sum, row) => sum + row.aloituspaikatLkm, 0),
  };
}

export function applyYearStatistics(schools: SchoolListItem[], statistics: StatisticsResponse): SchoolListItem[] {
  const rowsBySchool = new Map<string, StatisticsEntry[]>();
  for (const row of statistics) {
    const name = row.korkeakoulu;
    if (!name) continue;
    const rows = rowsBySchool.get(name);
    if (rows) rows.push(row);
    else rowsBySchool.set(name, [row]);
  }

  return schools.map((school) => ({
    ...school,
    ...schoolStatisticTotals(rowsBySchool.get(school.name) ?? []),
  }));
}
