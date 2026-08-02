import { Badge, Card, Collapsible, Heading, Separator, Span, Stack, Table, Text } from "@chakra-ui/react";
import { HiChevronDown } from "react-icons/hi";
import { COLORS } from "@/theme";
import type { ScoreResult } from "../lib/scoreResults";

interface ScoreResultCardProps {
  headingLevel?: "h3" | "h4";
  roundLabel: string;
  result: ScoreResult;
  showKoulutusala?: boolean;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

function KynnysehtoBadge({ passed }: { passed?: boolean }) {
  if (passed === true) {
    return (
      <Badge alignSelf="flex-start" bg={COLORS.accent} color={COLORS.text} size="sm">
        Kynnysehto täyttyy.
      </Badge>
    );
  }
  if (passed === false) {
    return (
      <Badge alignSelf="flex-start" colorPalette="red" size="sm" variant="subtle">
        Kynnysehto ei täyty.
      </Badge>
    );
  }
  return (
    <Badge
      alignSelf="flex-start"
      bg={`color-mix(in srgb, ${COLORS.text} 14%, ${COLORS.bg})`}
      color="fg.muted"
      size="sm"
    >
      Ei kynnysehtoa.
    </Badge>
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
            <Table.Row>
              <Table.ColumnHeader scope="col">Aine</Table.ColumnHeader>
              <Table.ColumnHeader scope="col">Arvosana</Table.ColumnHeader>
              <Table.ColumnHeader scope="col" textAlign="end">
                Pisteet
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((row) => (
              <Table.Row key={row.exam}>
                <Table.Cell color={row.muted ? "fg.muted" : undefined}>{row.label}</Table.Cell>
                <Table.Cell color={row.muted ? "fg.muted" : undefined}>{row.grade}</Table.Cell>
                <Table.Cell color={row.muted ? "fg.muted" : undefined} textAlign="end">
                  {row.points}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={2} fontWeight="semibold">
                Yhteensä
              </Table.Cell>
              <Table.Cell fontWeight="semibold" textAlign="end">
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
  const isQualified =
    displayedScore !== undefined && result.score <= displayedScore && result.kynnysehtoPassed !== false;
  const hasThreshold = result.kynnysehtoLabel !== undefined || result.kynnysehtoPassed !== undefined;
  const disclosureHeading = headingLevel === "h3" ? "h4" : "h5";

  return (
    <Card.Root as="article" size="sm">
      <Card.Body>
        <Stack gap={3}>
          <Stack>
            <Heading as={headingLevel} fontSize={{ base: "xs", md: "md" }} textWrap="pretty">
              {result.programmeName}
            </Heading>
            <Text color="fg.muted" fontSize="xs">
              {result.schoolName}
            </Text>
            {showKoulutusala ? (
              <Text color="fg.muted" fontSize="xs">
                {result.koulutusala}
              </Text>
            ) : null}
            <Badge alignSelf="flex-start" border="1px solid" borderColor={COLORS.accentFg} size="sm" variant="surface">
              {result.selectionMethod}
            </Badge>
          </Stack>
          <Separator />
          <Stack direction={{ base: "column", md: "row" }} justify="space-between">
            <Text color="fg.muted" fontSize="xs">
              Pisteesi / alin hyväksytty pistemäärä ({roundLabel})
            </Text>
            <Text color={isQualified ? "fg.accent" : "fg.muted"} fontSize="lg" fontWeight="bold" letterSpacing="wide">
              {displayedScore === undefined ? "–" : scoreFormatter.format(displayedScore)} /{" "}
              {scoreFormatter.format(result.score)}
            </Text>
          </Stack>
          {hasThreshold ? (
            <>
              {result.kynnysehtoPassed !== undefined ? <KynnysehtoBadge passed={result.kynnysehtoPassed} /> : null}
              {result.kynnysehtoLabel ? (
                <Text fontSize="xs">
                  <Text as="span" fontWeight="semibold">
                    Kynnysehto:{" "}
                  </Text>
                  {result.kynnysehtoLabel}
                </Text>
              ) : null}
            </>
          ) : displayedScore !== undefined && result.sector === "Yliopistokoulutus" ? (
            <KynnysehtoBadge />
          ) : null}
          {displayedScore !== undefined && result.scoreBreakdown ? (
            <ScoreBreakdownDisclosure
              applicantScore={displayedScore}
              breakdown={result.scoreBreakdown}
              disclosureHeading={disclosureHeading}
            />
          ) : null}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
