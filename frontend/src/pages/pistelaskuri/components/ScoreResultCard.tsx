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
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
