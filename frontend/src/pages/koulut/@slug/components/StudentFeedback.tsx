import { Accordion, Heading, Link, SimpleGrid, Stack, Stat, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import type {
  FeedbackField,
  FeedbackGroup,
  FeedbackMaxScore,
  FeedbackStatistics,
  StudentFeedback as StudentFeedbackData,
} from "@/api/dataValidation";
import type { FeedbackSurvey } from "@/api/serverData";
import { numberFormat, ratioFormat } from "@/lib/statistics";

interface StudentFeedbackProps {
  feedback: StudentFeedbackData;
  maxScore: FeedbackMaxScore;
  survey: FeedbackSurvey;
}

interface FeedbackStatsProps {
  maxScore: FeedbackMaxScore;
  statistics: FeedbackStatistics;
}

const collator = new Intl.Collator("fi");

function respondentText(count: number | null) {
  if (count == null) return "Vastaajamäärä ei saatavilla";
  return `${numberFormat.format(count)} ${count === 1 ? "vastaaja" : "vastaajaa"}`;
}

function FeedbackStats({ maxScore, statistics }: FeedbackStatsProps) {
  if (statistics.salattu) {
    return (
      <Text color="fg.muted" fontSize="sm">
        Alle 5 vastaajaa – arvo salattu.
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
          : `Keskimääräinen vastaus ${ratioFormat.format(statistics.keskiarvo)} / ${maxScore}`}
      </Text>
      {statistics.keskihajonta == null ? null : <Text>Keskihajonta {ratioFormat.format(statistics.keskihajonta)}</Text>}
    </Stack>
  );
}

function QuestionList({ group, maxScore }: { group: FeedbackGroup; maxScore: FeedbackMaxScore }) {
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
          <FeedbackStats maxScore={maxScore} statistics={item.tilastot} />
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

function TopicAccordionItem({
  group,
  maxScore,
  name,
  value,
}: {
  group: FeedbackGroup;
  maxScore: FeedbackMaxScore;
  name: string;
  value: string;
}) {
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
            right={<Text color="fg.accent">{averageText}</Text>}
            title={name}
            titleFontSize="sm"
          />
          <Accordion.ItemIndicator />
        </Accordion.ItemTrigger>
      </Heading>
      <Accordion.ItemContent>
        <Accordion.ItemBody pb={4} px={{ base: 3, md: 4 }}>
          <QuestionList group={group} maxScore={maxScore} />
        </Accordion.ItemBody>
      </Accordion.ItemContent>
    </Accordion.Item>
  );
}

export default function StudentFeedback({ feedback, maxScore, survey }: StudentFeedbackProps) {
  const fields = Object.entries(feedback.koulutusalat)
    .filter(([name]) => name !== "Tieto puuttuu")
    .sort(([a], [b]) => collator.compare(a, b));
  const isAvop = survey === "avop";

  return (
    <Stack gap={6}>
      <Stack gap={1}>
        <Text color="fg.muted" fontSize="xs">
          {isAvop
            ? "Ammattikorkeakoulujen opiskelijapalaute (AVOP)."
            : "Yliopistojen opiskelijapalaute (Kandipalaute)."}
        </Text>
        <Text color="fg.muted" fontSize="xs">
          {isAvop ? null : (
            <>
              Tulokset sisältävät vain rahoitusmallikysymykset.
              <br />
            </>
          )}
          1 = täysin eri mieltä • {maxScore} = täysin samaa mieltä.
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
          <Stat.ValueText color="fg.accent">
            {feedback.tilastot.keskiarvo == null
              ? "–"
              : `${ratioFormat.format(feedback.tilastot.keskiarvo)} / ${maxScore}`}
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
                      <Text color="fg.accent">Keskiarvo {ratioFormat.format(field.tilastot.keskiarvo)}</Text>
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
                    <TopicAccordionItem key={topic.value} maxScore={maxScore} {...topic} />
                  ))}
                </Accordion.Root>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      <Stack borderColor="border.subtle" borderTopWidth="1px" gap={2} pt={4}>
        <Text color="fg.muted" fontSize="xs" textWrap="pretty">
          {isAvop
            ? "Keskiarvot perustuvat valtakunnalliseen AVOP-kyselyyn, jossa ammattikorkeakouluista valmistuvat opiskelijat arvioivat koulutustaan."
            : "Keskiarvot perustuvat valtakunnalliseen kandipalautekyselyyn, jossa valmistuvat opiskelijat arvioivat koulutustaan."}
        </Text>
        <Text color="fg.muted" fontSize="xs">
          Lähde: Opetushallituksen tilastopalvelu{" "}
          <Link
            href={
              isAvop
                ? "https://vipunen.fi/fi-fi/amk/Sivut/Opiskelijapalaute.aspx"
                : "https://vipunen.fi/fi-fi/yliopisto/Sivut/Opiskelijapalaute.aspx"
            }
            textDecoration="underline"
          >
            Vipunen.fi
          </Link>
          .
        </Text>
      </Stack>
    </Stack>
  );
}
