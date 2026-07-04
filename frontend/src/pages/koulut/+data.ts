import { readPublicData, schoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";
import type { StatisticsResponse } from "@/types.gen";

export interface SchoolListItem {
  name: string;
  slug: string;
  sektori: string;
  hakukohteet: number;
  ensisijaisetHakijat: number;
}

export const data = (): SchoolListItem[] => {
  const statistics: StatisticsResponse = readPublicData("statistics-2026.json");
  return schoolNames().map((name) => {
    const rows = statistics.filter((s) => s.korkeakoulu === name);
    return {
      name,
      slug: slugifySchoolName(name),
      sektori: rows[0]?.sektori ?? "",
      hakukohteet: rows.length,
      ensisijaisetHakijat: rows.reduce((sum, r) => sum + r.ensisijaisetHakijatLkm, 0),
    };
  });
};
