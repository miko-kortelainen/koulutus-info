import { Badge, Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { ScoreResult } from "../+data";

interface ScoreResultCardProps {
  result: ScoreResult;
  userScore: number;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

export default function ScoreResultCard({ result, userScore }: ScoreResultCardProps) {
  return (
    <Card.Root as="article" size="md">
      <Card.Body>
        <Stack gap={3}>
          <Stack gap={1}>
            <Heading as="h3" fontSize={{ base: "sm", md: "md" }} textWrap="pretty">
              {result.programmeName}
            </Heading>
            <Text color="fg.muted" fontSize="sm">
              {result.schoolName}
            </Text>
            <Badge alignSelf="flex-start" variant="surface">
              {result.selectionMethod}
            </Badge>
          </Stack>
          <Stack direction={{ base: "column", md: "row" }} gap={1} justify="space-between">
            <Text color="fg.muted" fontSize="sm">
              Pisteesi / alin hyväksytty pistemäärä
            </Text>
            <Text color={result.score <= userScore ? "green.fg" : undefined} fontWeight="bold">
              {scoreFormatter.format(userScore)} / {scoreFormatter.format(result.score)}
            </Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
