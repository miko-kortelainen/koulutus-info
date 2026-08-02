import { Accordion, Heading, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { QUESTIONS } from "./questions";

const header = (
  <Heading as="h1" size="lg">
    Usein kysytyt kysymykset
  </Heading>
);

const questionAccordions = QUESTIONS.map(({ question, answer }) => (
  <Accordion.Item key={question} value={question}>
    <Accordion.ItemTrigger>
      <Text flex="1" fontSize="md" textAlign="start">
        {question}
      </Text>
      <Accordion.ItemIndicator />
    </Accordion.ItemTrigger>
    <Accordion.ItemContent>
      <Accordion.ItemBody>
        <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} textWrap="pretty">
          {answer}
        </Text>
      </Accordion.ItemBody>
    </Accordion.ItemContent>
  </Accordion.Item>
));

const questionStack = (
  <Stack gap={6} py={2}>
    <Accordion.Root collapsible>{questionAccordions}</Accordion.Root>
  </Stack>
);

export default function UKKPage() {
  return (
    <PageContainer align="flex-start">
      {header}
      {questionStack}
    </PageContainer>
  );
}
