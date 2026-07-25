import { Heading, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import PageContainer from "@/layout/PageContainer";
import { slugify } from "@/lib/slug";
import { COLORS } from "@/theme";
import StudentFeedback from "../components/StudentFeedback";
import type { FeedbackPageData } from "./+data";

export default function FeedbackPage() {
  const { schoolName, feedback, maxScore, survey, year } = useData<FeedbackPageData>();

  return (
    <PageContainer align="flex-start">
      <Stack gap={1}>
        <Link
          fontSize="sm"
          href={`/koulut/${slugify(schoolName)}/`}
          textDecoration="underline"
          textDecorationColor={COLORS.accentFg}
          textDecorationStyle="dotted"
        >
          ← Takaisin
        </Link>
        <Heading as="h1" size="md">
          {schoolName} – opiskelijapalautteet
        </Heading>
        <Text color="fg.muted" fontSize="sm" textWrap="pretty">
          Vuoden {year} opiskelijapalautteen tulokset koulutusaloittain.
        </Text>
        <Separator mt={2} />
      </Stack>
      <StudentFeedback feedback={feedback} maxScore={maxScore} survey={survey} />
    </PageContainer>
  );
}
