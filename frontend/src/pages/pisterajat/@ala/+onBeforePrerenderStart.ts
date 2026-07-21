import { cutoffAlaNames } from "@/api/serverData";
import { slugify } from "@/lib/slug";

export default function onBeforePrerenderStart() {
  return cutoffAlaNames().map((name) => `/pisterajat/${slugify(name)}/`);
}
