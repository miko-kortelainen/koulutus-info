import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import type { ScoreResult } from "../+data";

interface ScoreResultCardProps {
  result: ScoreResult;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export default function ScoreResultCard({ result }: ScoreResultCardProps) {
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
          </Stack>
          <Stack direction={{ base: "column", md: "row" }} gap={1} justify="space-between">
            <Text color="fg.muted" fontSize="sm">
              Alin hyväksytty pistemäärä
            </Text>
            <Text fontWeight="bold">{scoreFormatter.format(result.score)}</Text>
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
