import { cutoffSchoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";

export default function onBeforePrerenderStart() {
  return cutoffSchoolNames().map((name) => `/koulut/${slugifySchoolName(name)}/pisterajat`);
}
