import { lukioKuntaNames } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export default function onBeforePrerenderStart() {
  return lukioKuntaNames().map((name) => `/lukiot/kaupungit/${slugify(name)}/`);
}
