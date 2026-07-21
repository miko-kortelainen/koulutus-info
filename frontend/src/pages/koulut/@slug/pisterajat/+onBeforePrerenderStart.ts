import { cutoffSchoolNames } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export default function onBeforePrerenderStart() {
  return cutoffSchoolNames().map((name) => `/koulut/${slugify(name)}/pisterajat/`);
}
