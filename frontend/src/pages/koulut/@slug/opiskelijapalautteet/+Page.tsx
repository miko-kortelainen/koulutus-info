import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { slugify } from "@/lib/slug";
import StudentFeedback from "@/pages/koulut/@slug/components/StudentFeedback";
import type { FeedbackPageData } from "@/pages/koulut/@slug/opiskelijapalautteet/+data";

export default function FeedbackPage() {
  const { schoolName, feedback, maxScore, survey, year } = useData<FeedbackPageData>();

  return (
    <>
      <PageIntro
        description={`Vuoden ${year} opiskelijapalautteen vastauksien keskiarvot koulutusaloittain.`}
        title={`${schoolName} opiskelijapalautteet`}
      />
      <PageContainer align="flex-start">
        <BackLink href={`/koulut/${slugify(schoolName)}/`} />
        <StudentFeedback feedback={feedback} maxScore={maxScore} survey={survey} />
      </PageContainer>
    </>
  );
}
