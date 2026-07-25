import { Heading, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import PageContainer from "@/layout/PageContainer";
import { slugify } from "@/lib/slug";
import { COLORS } from "@/theme";
import UniversityFeedback from "../components/UniversityFeedback";
import type { FeedbackPageData } from "./+data";

export default function FeedbackPage() {
  const { schoolName, feedback, feedbackYear } = useData<FeedbackPageData>();

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
          Vuoden {feedbackYear} opiskelijapalautteen tulokset koulutusaloittain.
        </Text>
        <Separator mt={2} />
      </Stack>
      <UniversityFeedback feedback={feedback} />
    </PageContainer>
  );
}
