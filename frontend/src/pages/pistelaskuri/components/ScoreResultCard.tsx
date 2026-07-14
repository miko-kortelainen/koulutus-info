import { Badge, Card, Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { COLORS } from "@/theme";
import type { ScoreResult } from "../lib/scoreResults";

interface ScoreResultCardProps {
  roundLabel: string;
  result: ScoreResult;
  userScore?: number;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

export default function ScoreResultCard({ result, roundLabel, userScore }: ScoreResultCardProps) {
  const isQualified = userScore !== undefined && result.score <= userScore;

  return (
    <Card.Root as="article" size="sm">
      <Card.Body>
        <Stack gap={3}>
          <Stack>
            <Heading as="h3" fontSize={{ base: "xs", md: "md" }} textWrap="pretty">
              {result.programmeName}
            </Heading>
            <Text color="fg.muted" fontSize="xs">
              {result.schoolName}
            </Text>
            <Badge alignSelf="flex-start" border="1px solid" borderColor={COLORS.accent} size="sm" variant="surface">
              {result.selectionMethod}
            </Badge>
          </Stack>
          <Separator />
          <Stack direction={{ base: "column", md: "row" }} justify="space-between">
            <Text color="fg.muted" fontSize="xs">
              Pisteesi / alin hyväksytty pistemäärä ({roundLabel})
            </Text>
            <Text color={isQualified ? COLORS.accent : undefined} fontSize="sm" fontWeight="bold">
              {userScore === undefined ? "–" : scoreFormatter.format(userScore)} / {scoreFormatter.format(result.score)}
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
