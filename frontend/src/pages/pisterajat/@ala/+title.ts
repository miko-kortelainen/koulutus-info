import type { PageContext } from "vike/types";
import type { AlaPageData } from "./+data";

export default (pageContext: PageContext) => `${(pageContext.data as AlaPageData).alaName} – pisterajat`;
