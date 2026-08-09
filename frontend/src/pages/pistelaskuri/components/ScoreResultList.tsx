import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { ScoreResult } from "@/pages/pistelaskuri/lib/scoreResults";
import ScoreResultCard from "@/pages/pistelaskuri/components/ScoreResultCard";

const BATCH_SIZE = 20;

interface ScoreResultListProps {
  headingLevel?: "h3" | "h4";
  results: ScoreResult[];
  roundLabel: string;
  showKoulutusala?: boolean;
}

export default function ScoreResultList({ headingLevel, results, roundLabel, showKoulutusala }: ScoreResultListProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleResults.length < results.length;

  return (
    <Stack gap={4}>
      <Stack as="ul" gap={4} listStyleType="none">
        {visibleResults.map((result) => (
          <Box as="li" key={result.id}>
            <ScoreResultCard
              headingLevel={headingLevel}
              result={result}
              roundLabel={roundLabel}
              showKoulutusala={showKoulutusala}
            />
          </Box>
        ))}
      </Stack>
      <Stack align="center" gap={2}>
        <Text aria-live="polite" color="fg.muted" fontSize="xs">
          Näytetään {visibleResults.length} / {results.length}
        </Text>
        {hasMore ? (
          <Button
            onClick={() => setVisibleCount((count) => Math.min(count + BATCH_SIZE, results.length))}
            size="sm"
            variant="outline"
            width={{ base: "full", md: "auto" }}
          >
            Näytä lisää
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
