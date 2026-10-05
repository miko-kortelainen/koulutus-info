import type { PageContext } from "vike/types";
import type { YoPisterajatPageData } from "@/pages/yo-pisterajat/+data";

export default function title(pageContext: PageContext) {
  const rounds = pageContext.data as YoPisterajatPageData;
  return `YO-pisterajat ${rounds[rounds.length - 1].vuosi}–${rounds[0].vuosi} – kevät ja syksy aineittain`;
}
