import { Accordion, Heading, Link, SimpleGrid, Stack, Stat, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {
  FeedbackField,
  FeedbackGroup,
  FeedbackStatistics,
  UniversityFeedback as UniversityFeedbackData,
} from "@/api/dataValidation";
import { numberFormat, ratioFormat } from "@/lib/statistics";

interface UniversityFeedbackProps {
  feedback: UniversityFeedbackData;
}

interface FeedbackStatsProps {
  statistics: FeedbackStatistics;
}

const collator = new Intl.Collator("fi");

function respondentText(count: number | null) {
  if (count == null) return "Vastaajamäärä ei saatavilla";
  return `${numberFormat.format(count)} ${count === 1 ? "vastaaja" : "vastaajaa"}`;
}

function FeedbackStats({ statistics }: FeedbackStatsProps) {
  if (statistics.salattu) {
    return (
      <Text color="fg.muted" fontSize="sm">
        Alle 5 vastaajaa - N/A
      </Text>
    );
  }

  return (
    <Stack
      align={{ base: "flex-start", md: "center" }}
      color="fg.muted"
      direction={{ base: "column", md: "row" }}
      flexShrink={0}
      fontSize="xs"
      gap={{ base: 0, md: 3 }}
    >
      <Text>{respondentText(statistics.vastaajatLkm)}</Text>
      <Text>
        {statistics.keskiarvo == null
          ? "Ei numeerista vastausta"
          : `Keskimääräinen vastaus ${ratioFormat.format(statistics.keskiarvo)} / 5`}
      </Text>
      {statistics.keskihajonta == null ? null : <Text>Keskihajonta {ratioFormat.format(statistics.keskihajonta)}</Text>}
    </Stack>
  );
}

function QuestionList({ group }: { group: FeedbackGroup }) {
  return (
    <Stack as="ul" gap={0} listStyleType="none">
      {group.kohteet.map((item) => (
        <Stack
          align={{ base: "flex-start", md: "center" }}
          as="li"
          borderBottomColor="border.subtle"
          borderBottomWidth="1px"
          direction={{ base: "column", md: "row" }}
          gap={2}
          justify="space-between"
          key={item.kohde}
          py={3}
        >
          <Text fontSize="xs" lineHeight="tall" textWrap="pretty">
            {item.kohde}
          </Text>
          <FeedbackStats statistics={item.tilastot} />
        </Stack>
      ))}
    </Stack>
  );
}

function feedbackTopics(field: FeedbackField) {
  return Object.entries(field.osiot)
    .flatMap(([sectionName, section]) => {
      if ("kohteet" in section) {
        return [{ group: section, name: sectionName, value: sectionName }];
      }
      return Object.entries(section.tasot).map(([groupName, group]) => ({
        group,
        name: /^[IVX]+$/.test(groupName) ? `${sectionName} – osa ${groupName}` : groupName,
        value: `${sectionName}:${groupName}`,
      }));
    })
    .sort((a, b) => collator.compare(a.name, b.name));
}

function AccordionHeaderRow({
  title,
  titleFontSize,
  left,
  right,
}: {
  title: string;
  titleFontSize?: string;
  left: ReactNode;
  right: ReactNode;
}) {
  return (
    <Stack
      align={{ base: "flex-start", md: "center" }}
      direction={{ base: "column", md: "row" }}
      flex={1}
      gap={{ base: 1, md: 4 }}
      justify="space-between"
      textAlign="start"
    >
      <Text flex={{ md: 2 }} fontSize={titleFontSize} fontWeight="semibold" minW={0}>
        {title}
      </Text>
      <Stack
        color="fg.muted"
        direction="row"
        flex={{ md: 1 }}
        fontSize="sm"
        justify="space-between"
        minW={{ md: "16rem" }}
        width={{ base: "full", md: "auto" }}
      >
        {left}
        {right}
      </Stack>
    </Stack>
  );
}

function TopicAccordionItem({ group, name, value }: { group: FeedbackGroup; name: string; value: string }) {
  const questionCount = group.kohteet.length;
  const average = group.tilastot.keskiarvo;
  const averageText = group.tilastot.salattu
    ? "Alle 5 vastaajaa"
    : average == null
      ? "Keskiarvo ei saatavilla"
      : `Keskiarvo ${ratioFormat.format(average)}`;

  return (
    <Accordion.Item value={value}>
      <Heading as="h3" size="xs">
        <Accordion.ItemTrigger px={{ base: 3, md: 4 }} py={3}>
          <AccordionHeaderRow
            left={<Text fontSize="xs">Kysymyksiä: {questionCount}</Text>}
            right={<Text color="accent">{averageText}</Text>}
            title={name}
            titleFontSize="sm"
          />
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </Heading>
      <Accordion.ItemContent>
        <Accordion.ItemBody pb={4} px={{ base: 3, md: 4 }}>
          <QuestionList group={group} />
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

export default function UniversityFeedback({ feedback }: UniversityFeedbackProps) {
  const fields = Object.entries(feedback.koulutusalat)
    .filter(([name]) => name !== "Tieto puuttuu")
    .sort(([a], [b]) => collator.compare(a, b));

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Text color="fg.muted" fontSize="xs">
          Yliopistojen opiskelijapalaute (Kandipalaute).
        </Text>
        <Text color="fg.muted" fontSize="xs">
          Tulokset sisältävät vain rahoitusmallikysymykset.
          <br />1 = täysin eri mieltä • 5 = täysin samaa mieltä.
        </Text>
      </Stack>

      <SimpleGrid columns={2} gap={4}>
        <Stat.Root borderColor="border" borderRadius="md" borderWidth="1px" p={4} size="sm">
          <Stat.Label>Vastaajia</Stat.Label>
          <Stat.ValueText>
            {feedback.tilastot.vastaajatLkm == null ? "–" : numberFormat.format(feedback.tilastot.vastaajatLkm)}
          </Stat.ValueText>
        </Stat.Root>
        <Stat.Root borderColor="border" borderRadius="md" borderWidth="1px" p={4} size="sm">
          <Stat.Label>Keskiarvo</Stat.Label>
          <Stat.ValueText color="accentFg">
            {feedback.tilastot.keskiarvo == null ? "–" : ratioFormat.format(feedback.tilastot.keskiarvo)}
          </Stat.ValueText>
        </Stat.Root>
      </SimpleGrid>

      <Accordion.Root aria-label="Opiskelijapalaute koulutusaloittain" collapsible lazyMount>
        {fields.map(([fieldName, field]) => (
          <Accordion.Item key={fieldName} value={fieldName}>
            <Heading as="h2" size="sm">
              <Accordion.ItemTrigger py={4}>
                <AccordionHeaderRow
                  left={
                    <Text marginInlineStart={field.tilastot.keskiarvo == null ? "auto" : undefined}>
                      {field.tilastot.salattu ? "Alle 5 vastaajaa" : respondentText(field.tilastot.vastaajatLkm)}
                    </Text>
                  }
                  right={
                    field.tilastot.keskiarvo == null ? null : (
                      <Text color="accentFg">Keskiarvo {ratioFormat.format(field.tilastot.keskiarvo)}</Text>
                    )
                  }
                  title={fieldName}
                />
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
            </Heading>
            <Accordion.ItemContent>
              <Accordion.ItemBody pb={6}>
                <Accordion.Root
                  aria-label={`${fieldName}: palautteen aiheet`}
                  borderColor="border.subtle"
                  borderWidth="1px"
                  collapsible
                  lazyMount
                  rounded="md"
                >
                  {feedbackTopics(field).map((topic) => (
                    <TopicAccordionItem key={topic.value} {...topic} />
                  ))}
                </Accordion.Root>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <Stack borderColor="border.subtle" borderTopWidth="1px" gap={2} pt={4}>
        <Text color="fg.muted" fontSize="xs" textWrap="pretty">
          Keskiarvot perustuvat valtakunnalliseen kandipalautekyselyyn, jossa valmistuvat opiskelijat arvioivat
          koulutustaan.
        </Text>
        <Text color="fg.muted" fontSize="xs">
          Lähde: Opetushallituksen tilastopalvelu{" "}
          <Link href="https://vipunen.fi/fi-fi/yliopisto/Sivut/Opiskelijapalaute.aspx" textDecoration="underline">
            Vipunen.fi
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  );
}
