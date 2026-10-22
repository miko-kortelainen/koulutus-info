import { allCutoffSchools, cutoffAlaNames, cutoffSchoolNames, formatSchoolName } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export interface CutoffIndexData {
  alat: { name: string; slug: string }[];
  schools: { name: string; slug: string; sector: string | undefined }[];
}

export const data = (): CutoffIndexData => {
  const sectors = new Map(allCutoffSchools().map((school) => [school.name, school.sector] as const));
  return {
    alat: cutoffAlaNames().map((name) => ({ name, slug: slugify(name) })),
    schools: cutoffSchoolNames().map((name) => ({
      name: formatSchoolName(name),
      slug: slugify(name),
      sector: sectors.get(name),
    })),
  };
};
