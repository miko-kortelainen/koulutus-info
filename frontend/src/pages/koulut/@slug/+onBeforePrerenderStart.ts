import { schoolNames } from "@/api/loadData";
import { slugify } from "@/components/slug";

export default function onBeforePrerenderStart() {
  return schoolNames().map((name) => `/koulut/${slugify(name)}/`);
}
