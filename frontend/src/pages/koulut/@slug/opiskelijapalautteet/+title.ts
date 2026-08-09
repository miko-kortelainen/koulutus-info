import type { PageContext } from "vike/types";
import type { FeedbackPageData } from "@/pages/koulut/@slug/opiskelijapalautteet/+data";

export default (pageContext: PageContext) => {
  const { schoolName } = pageContext.data as FeedbackPageData;
  return `${schoolName} – opiskelijapalautteet`;
};
