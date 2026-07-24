import {
  readCurrentYearStatistics,
  readSchools,
  readUniversityFeedback,
  schoolNames,
  UNIVERSITY_FEEDBACK_YEAR,
} from "@/api/serverData";
import { slugify } from "@/lib/slug";

export interface SchoolListItem {
  name: string;
  slug: string;
  sektori: string;
  koulutuksia: number;
  kaikkiHakijat: number;
  valitut: number;
  ensisijaisetHakijat: number;
  aloituspaikat: number;
  feedbackAverage: number | null;
  feedbackYear: number | null;
}

export const data = (): SchoolListItem[] => {
  const statistics = readCurrentYearStatistics();
  const schools = readSchools();
  const feedback = readUniversityFeedback();
  const toteutukset = schools.flatMap((k) => k.toteutukset);
  return schoolNames().map((name) => {
    const rows = statistics.filter((s) => s.korkeakoulu === name);
    const schoolFeedback = feedback[name];
    return {
      name,
      slug: slugify(name),
      sektori: rows[0]?.sektori ?? "",
      koulutuksia: toteutukset.filter((t) => t.oppilaitosNimi.fi === name).length,
      kaikkiHakijat: rows.reduce((sum, r) => sum + r.kaikkiHakijatLkm, 0),
      valitut: rows.reduce((sum, r) => sum + r.valitutLkm, 0),
      ensisijaisetHakijat: rows.reduce((sum, r) => sum + r.ensisijaisetHakijatLkm, 0),
      aloituspaikat: rows.reduce((sum, r) => sum + r.aloituspaikatLkm, 0),
      feedbackAverage: schoolFeedback?.tilastot.keskiarvo ?? null,
      feedbackYear: schoolFeedback ? UNIVERSITY_FEEDBACK_YEAR : null,
    };
  });
};
