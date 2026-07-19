import { cutoffAlaNames, cutoffSchoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";

export interface CutoffIndexData {
  alat: { name: string; slug: string }[];
  schools: { name: string; slug: string }[];
}

export const data = (): CutoffIndexData => ({
  alat: cutoffAlaNames().map((name) => ({ name, slug: slugifySchoolName(name) })),
  schools: cutoffSchoolNames().map((name) => ({ name, slug: slugifySchoolName(name) })),
});
