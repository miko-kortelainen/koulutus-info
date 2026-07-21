import { schoolNames } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export default function onBeforePrerenderStart() {
  return schoolNames().map((name) => `/koulut/${slugify(name)}/`);
}
