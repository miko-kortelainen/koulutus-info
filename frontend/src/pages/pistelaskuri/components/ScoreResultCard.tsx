import { Badge, Card, Heading, Separator, Stack, Text } from "@chakra-ui/react";
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
              {result.kynnysehtoLabel ? (
                <Text fontSize="xs">
                  <Text as="span" fontWeight="semibold">
                    Kynnysehto:{" "}
                  </Text>
                  {result.kynnysehtoLabel}
                </Text>
              ) : null}
              {result.kynnysehtoPassed !== undefined ? (
                <Text color={result.kynnysehtoPassed ? "fg.accent" : "fg.error"} fontSize="xs">
                  Kynnysehto {result.kynnysehtoPassed ? "täyttyy" : "ei täyty"}.
                </Text>
              ) : null}
            </>
          ) : result.sector === "Yliopistokoulutus" ? (
            <Text color="fg.muted" fontSize="xs">
              Ei kynnysehtoa.
            </Text>
          ) : null}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
