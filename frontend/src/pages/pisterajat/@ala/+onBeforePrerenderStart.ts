import { cutoffAlaNames } from "@/api/loadData";
import { slugify } from "@/components/slug";

export default function onBeforePrerenderStart() {
  return cutoffAlaNames().map((name) => `/pisterajat/${slugify(name)}/`);
}
