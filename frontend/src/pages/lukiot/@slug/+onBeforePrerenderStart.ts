import { lukioSchoolNames } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export default function onBeforePrerenderStart() {
  return lukioSchoolNames().map((name) => `/lukiot/${slugify(name)}/`);
}
