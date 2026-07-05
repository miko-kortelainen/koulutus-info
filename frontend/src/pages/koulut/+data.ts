import { readCurrentYearStatistics, readPublicData, schoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";
import type { SchoolsResponse } from "@/types.gen";

export interface SchoolListItem {
  name: string;
  slug: string;
  sektori: string;
  koulutuksia: number;
  kaikkiHakijat: number;
  ensisijaisetHakijat: number;
  aloituspaikat: number;
}

export const data = (): SchoolListItem[] => {
  const statistics = readCurrentYearStatistics();
  const schools: SchoolsResponse = readPublicData("schools.json");
  const toteutukset = schools.flatMap((k) => k.toteutukset);
  return schoolNames().map((name) => {
    const rows = statistics.filter((s) => s.korkeakoulu === name);
    return {
      name,
      slug: slugifySchoolName(name),
      sektori: rows[0]?.sektori ?? "",
      koulutuksia: toteutukset.filter((t) => t.oppilaitosNimi.fi === name).length,
      kaikkiHakijat: rows.reduce((sum, r) => sum + r.kaikkiHakijatLkm, 0),
      ensisijaisetHakijat: rows.reduce((sum, r) => sum + r.ensisijaisetHakijatLkm, 0),
      aloituspaikat: rows.reduce((sum, r) => sum + r.aloituspaikatLkm, 0),
    };
  });
};
