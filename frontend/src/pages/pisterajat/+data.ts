import { cutoffAlaNames, cutoffSchoolNames } from "@/api/loadData";
import { slugify } from "@/components/slug";

export interface CutoffIndexData {
  alat: { name: string; slug: string }[];
  schools: { name: string; slug: string }[];
}

export const data = (): CutoffIndexData => ({
  alat: cutoffAlaNames().map((name) => ({ name, slug: slugify(name) })),
  schools: cutoffSchoolNames().map((name) => ({ name, slug: slugify(name) })),
});
