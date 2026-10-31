import { Accordion, Heading, Text } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { QUESTIONS } from "@/pages/ukk/questions";

export default function UKKPage() {
  return (
    <>
      <PageIntro
        description="Vastauksia yleisimpiin kysymyksiin yhteishaku.app-palvelusta ja sen tietolähteistä."
        title="Usein kysytyt kysymykset"
      />
      <PageContainer align="flex-start">
        <Accordion.Root collapsible display="flex" flexDirection="column" gap={3} width="full">
          {QUESTIONS.map(({ question, answer }) => (
            <Accordion.Item key={question} value={question}>
              <Heading as="h2" size="sm">
                <Accordion.ItemTrigger py={4}>
                  <Text as="span" flex="1" fontSize="md" textAlign="start">
                    {question}
                  </Text>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </Heading>
              <Accordion.ItemContent>
                <Accordion.ItemBody pb={6}>
                  <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} textWrap="pretty">
                    {answer}
                  </Text>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </PageContainer>
    </>
  );
}
