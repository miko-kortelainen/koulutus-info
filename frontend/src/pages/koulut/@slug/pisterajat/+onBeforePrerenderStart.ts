import { cutoffSchoolNames } from "@/api/loadData";
import { slugify } from "@/components/slug";

export default function onBeforePrerenderStart() {
  return cutoffSchoolNames().map((name) => `/koulut/${slugify(name)}/pisterajat/`);
}
