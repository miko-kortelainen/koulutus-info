import { schoolNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";

export default function onBeforePrerenderStart() {
  return schoolNames().map((name) => `/koulut/${slugifySchoolName(name)}`);
}
