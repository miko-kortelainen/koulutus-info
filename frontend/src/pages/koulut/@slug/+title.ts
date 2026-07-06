import type { PageContext } from "vike/types";
import type { SchoolPageData } from "./+data";

export default (pageContext: PageContext) => `${(pageContext.data as SchoolPageData).schoolName} – yhteishaun tilastot`;
