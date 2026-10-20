import type { PageContext } from "vike/types";
import type { YoPisterajatPageData } from "@/pages/yo-pisterajat/+data";

export default function title(pageContext: PageContext) {
  const rounds = pageContext.data as YoPisterajatPageData;
  return `YO-pisterajat ${rounds[0].vuosi} (syksy ja kevät) – ylioppilaskirjoitusten pisterajat`;
}
