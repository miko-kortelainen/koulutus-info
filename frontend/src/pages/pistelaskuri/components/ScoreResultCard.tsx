import { Badge, Card, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { COLORS } from "@/theme";
import type { ScoreResult } from "../lib/scoreResults";

interface ScoreResultCardProps {
  headingLevel?: "h3" | "h4";
  roundLabel: string;
  result: ScoreResult;
  showKoulutusala?: boolean;
  userScore?: number;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

export default function ScoreResultCard({
  headingLevel = "h3",
  result,
  roundLabel,
  showKoulutusala,
  userScore,
}: ScoreResultCardProps) {
  const isQualified = userScore !== undefined && result.score <= userScore;

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
              {userScore === undefined ? "–" : scoreFormatter.format(userScore)} / {scoreFormatter.format(result.score)}
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
