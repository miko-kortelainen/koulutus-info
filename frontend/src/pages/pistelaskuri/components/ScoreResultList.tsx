import { Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { ScoreResult } from "../lib/scoreResults";
import ScoreResultCard from "./ScoreResultCard";

const BATCH_SIZE = 20;

interface ScoreResultListProps {
  results: ScoreResult[];
  roundLabel: string;
  showKoulutusala?: boolean;
  userScore?: number;
}

export default function ScoreResultList({
  results,
  roundLabel,
  showKoulutusala,
  userScore,
}: ScoreResultListProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const visibleResults = results.slice(0, visibleCount);
  const hasMore = visibleResults.length < results.length;

  return (
    <Stack gap={4}>
      {visibleResults.map((result) => (
        <ScoreResultCard
          key={result.id}
          result={result}
          roundLabel={roundLabel}
          showKoulutusala={showKoulutusala}
          userScore={userScore}
        />
      ))}
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
