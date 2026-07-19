import { cutoffAlaNames } from "@/api/loadData";
import { slugifySchoolName } from "@/components/slug";

export default function onBeforePrerenderStart() {
  return cutoffAlaNames().map((name) => `/pisterajat/${slugifySchoolName(name)}/`);
}
