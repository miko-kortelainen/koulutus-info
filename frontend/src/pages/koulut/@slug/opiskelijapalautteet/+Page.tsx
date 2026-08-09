import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import BackLink from "@/components/BackLink";
import PageContainer from "@/layout/PageContainer";
import { slugify } from "@/lib/slug";
import StudentFeedback from "@/pages/koulut/@slug/components/StudentFeedback";
import type { FeedbackPageData } from "@/pages/koulut/@slug/opiskelijapalautteet/+data";

export default function FeedbackPage() {
  const { schoolName, feedback, maxScore, survey, year } = useData<FeedbackPageData>();

  return (
    <PageContainer align="flex-start">
      <Stack gap={1}>
        <BackLink href={`/koulut/${slugify(schoolName)}/`} />
        <Heading as="h1" size="md">
          {schoolName} opiskelijapalautteet
        </Heading>
        <Text color="fg.muted" fontSize="sm" textWrap="pretty">
          Vuoden {year} opiskelijapalautteen vastauksien keskiarvot koulutusaloittain.
        </Text>
        <Separator mt={2} />
      </Stack>
      <StudentFeedback feedback={feedback} maxScore={maxScore} survey={survey} />
    </PageContainer>
  );
}
