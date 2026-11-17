import {
  Badge,
  Card,
  Collapsible,
  Flex,
  Heading,
  HStack,
  Separator,
  SimpleGrid,
  Span,
  Stack,
  Stat,
  Table,
  Text,
} from "@chakra-ui/react";
import { HiCheckCircle, HiChevronDown, HiExclamationCircle } from "react-icons/hi";
import type { ScoreResult } from "@/pages/todistusvalintalaskuri/lib/scoreResults";
import { COLORS } from "@/theme";

interface ScoreResultCardProps {
  headingLevel?: "h3" | "h4";
  roundLabel: string;
  result: ScoreResult;
  showKoulutusala?: boolean;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

function QualificationBadge({ kynnysehtoPassed, scorePasses }: { kynnysehtoPassed?: boolean; scorePasses: boolean }) {
  if (scorePasses && kynnysehtoPassed !== false) {
    return (
      <Badge alignSelf="flex-start" bg="accent" color="onAccent" flexShrink={0} size="sm">
        Pisteet riittävät
      </Badge>
    );
  }
  if (scorePasses && kynnysehtoPassed === false) {
    return (
      <Badge alignSelf="flex-start" colorPalette="red" flexShrink={0} size="sm" variant="subtle">
        Kynnysehto ei täyty
      </Badge>
    );
  }
  return (
    <Badge
      alignSelf="flex-start"
      bg={`color-mix(in srgb, ${COLORS.text} 14%, ${COLORS.bg})`}
      color="fg"
      flexShrink={0}
      size="sm"
    >
      Pisteesi eivät riitä
    </Badge>
  );
}

function ThresholdNote({ label, passed }: { label?: string; passed?: boolean }) {
  if (passed === undefined) {
    if (!label) return null;
    return (
      <Text color="fg.muted" fontSize="xs">
        <Text as="span" color="fg" fontWeight="semibold">
          Kynnysehto:{" "}
        </Text>
        {label}
      </Text>
    );
  }

  return (
    <HStack align="center" color={passed ? "fg.accent" : "fg.error"} fontSize="xs" gap={1.5}>
      <Span display="inline-flex" flexShrink={0} fontSize="sm">
        {passed ? <HiCheckCircle aria-hidden="true" /> : <HiExclamationCircle aria-hidden="true" />}
      </Span>
      <Text>{label ?? (passed ? "Kynnysehto täyttyy." : "Kynnysehto ei täyty.")}</Text>
    </HStack>
  );
}

function ScoreBreakdownDisclosure({
  applicantScore,
  breakdown,
  disclosureHeading,
}: {
  applicantScore: number;
  breakdown: NonNullable<ScoreResult["scoreBreakdown"]>;
  disclosureHeading: "h4" | "h5";
}) {
  const rows = breakdown.rows.map((row) => ({
    exam: row.exam,
    label: row.label,
    grade: row.grade,
    points: row.points === null ? "–" : scoreFormatter.format(row.points),
    muted: row.points === null,
  }));

  return (
    <Collapsible.Root>
      <Heading as={disclosureHeading} fontSize="xs" fontWeight="medium">
        <Collapsible.Trigger
          _focusVisible={{ outline: "2px solid", outlineColor: "fg.accent", outlineOffset: "2px" }}
          alignItems="center"
          color="fg.muted"
          cursor="pointer"
          display="flex"
          gap={2}
          textAlign="start"
          width="100%"
        >
          <Span flex="1">Miten pisteeni laskettiin?</Span>
          <Collapsible.Indicator _open={{ transform: "rotate(180deg)" }} aria-hidden>
            <HiChevronDown />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
      </Heading>
      <Collapsible.Content pt={3}>
        <Table.Root aria-label="Pisteytyksen erittely aineittain" size="sm" variant="line">
          <Table.Header>
            <Table.Row bg="transparent">
              <Table.ColumnHeader scope="col">Aine</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Arvosana</Table.ColumnHeader>
              <Table.ColumnHeader scope="col" textAlign="end">
                Pisteet
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row bg="transparent" key={row.exam}>
                <Table.Cell color={row.muted ? "fg.muted" : undefined}>{row.label}</Table.Cell>
                <Table.Cell color={row.muted ? "fg.muted" : undefined}>{row.grade}</Table.Cell>
                <Table.Cell
                  color={row.muted ? "fg.muted" : undefined}
                  fontVariantNumeric="tabular-nums"
                  textAlign="end"
                >
                  {row.points}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row bg="transparent">
              <Table.Cell colSpan={2} fontWeight="semibold">
                Yhteensä
              </Table.Cell>
              <Table.Cell fontVariantNumeric="tabular-nums" fontWeight="semibold" textAlign="end">
                {scoreFormatter.format(applicantScore)}
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export default function ScoreResultCard({
  headingLevel = "h3",
  result,
  roundLabel,
  showKoulutusala,
}: ScoreResultCardProps) {
  const displayedScore = result.applicantScore;
  const scorePasses = displayedScore !== undefined && result.score <= displayedScore;
  const isQualified = scorePasses && result.kynnysehtoPassed !== false;
  const hasThreshold = result.kynnysehtoLabel !== undefined || result.kynnysehtoPassed !== undefined;
  const disclosureHeading = headingLevel === "h3" ? "h4" : "h5";

  return (
    <Card.Root as="article" size="sm">
      <Card.Body>
        <Stack gap={3}>
          <Flex align="flex-start" direction={{ base: "column", sm: "row" }} gap={2} justify="space-between">
            <Stack flex={1} gap={1} minW={0}>
              <Heading as={headingLevel} fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" textWrap="pretty">
                {result.programmeName}
              </Heading>
              <HStack color="fg.muted" flexWrap="wrap" fontSize="xs" gap={1.5}>
                <Text>{result.schoolName}</Text>
                <Span aria-hidden="true">·</Span>
                <Text>{result.selectionMethod}</Text>
                {showKoulutusala ? (
                  <>
                    <Span aria-hidden="true">·</Span>
                    <Text>{result.koulutusala}</Text>
                  </>
                ) : null}
              </HStack>
            </Stack>
            {displayedScore !== undefined ? (
              <QualificationBadge kynnysehtoPassed={result.kynnysehtoPassed} scorePasses={scorePasses} />
            ) : null}
          </Flex>
          <Separator />
          {displayedScore === undefined ? (
            <HStack align="baseline" gap={4} justify="space-between">
              <Text color="fg.muted" fontSize="xs">
                Pisteraja ({roundLabel})
              </Text>
              <Text fontSize="lg" fontVariantNumeric="tabular-nums" fontWeight="bold" letterSpacing="wide">
                {scoreFormatter.format(result.score)}
              </Text>
            </HStack>
          ) : (
            <SimpleGrid columns={2} gap={4}>
              <Stat.Root gap={0.5} size="sm">
                <Stat.Label color="fg.muted" fontSize="xs">
                  Pisteesi
                </Stat.Label>
                <Stat.ValueText
                  color={isQualified ? "fg.accent" : "fg"}
                  fontSize="lg"
                  fontVariantNumeric="tabular-nums"
                  fontWeight="bold"
                >
                  {scoreFormatter.format(displayedScore)}
                </Stat.ValueText>
              </Stat.Root>
              <Stat.Root gap={0.5} size="sm">
                <Stat.Label color="fg.muted" fontSize="xs">
                  Pisteraja ({roundLabel})
                </Stat.Label>
                <Stat.ValueText fontSize="lg" fontVariantNumeric="tabular-nums" fontWeight="bold">
                  {scoreFormatter.format(result.score)}
                </Stat.ValueText>
              </Stat.Root>
            </SimpleGrid>
          )}
          {hasThreshold ? <ThresholdNote label={result.kynnysehtoLabel} passed={result.kynnysehtoPassed} /> : null}
          {displayedScore !== undefined && result.scoreBreakdown ? (
            <>
              <Separator />
              <ScoreBreakdownDisclosure
                applicantScore={displayedScore}
                breakdown={result.scoreBreakdown}
                disclosureHeading={disclosureHeading}
              />
            </>
          ) : null}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
