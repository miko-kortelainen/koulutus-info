import { feedbackSchoolNames } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export default function onBeforePrerenderStart() {
  return feedbackSchoolNames().map((name) => `/koulut/${slugify(name)}/opiskelijapalautteet/`);
}
