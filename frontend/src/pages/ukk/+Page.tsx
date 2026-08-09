import { Accordion, Heading, Stack, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { QUESTIONS } from "@/pages/ukk/questions";

export default function UKKPage() {
  return (
    <PageContainer align="flex-start">
      <Heading as="h1" size="lg">
        Usein kysytyt kysymykset
      </Heading>
      <Stack gap={6} py={2}>
        <Accordion.Root collapsible>
          {QUESTIONS.map(({ question, answer }) => (
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
          ))}
        </Accordion.Root>
      </Stack>
    </PageContainer>
  );
}
