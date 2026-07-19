import type { PageContext } from "vike/types";
import type { CutoffPageData } from "./+data";

export default (pageContext: PageContext) => `${(pageContext.data as CutoffPageData).schoolName} – pisterajat`;
