import type { PageContext } from "vike/types";
import type { FeedbackPageData } from "./+data";

export default (pageContext: PageContext) => {
  const { schoolName, year } = pageContext.data as FeedbackPageData;
  return `${schoolName} – opiskelijapalaute ${year}`;
};
