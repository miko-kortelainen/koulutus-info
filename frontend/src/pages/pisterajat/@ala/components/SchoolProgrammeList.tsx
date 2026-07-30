import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import CutoffCard from "@/components/CutoffCard";
import type { ProgrammeWithRounds } from "@/lib/cutoffs";

const BATCH_SIZE = 20;

interface SchoolProgrammeListProps {
  programmes: ProgrammeWithRounds[];
  headingLevel?: "h3";
}

export default function SchoolProgrammeList({ headingLevel, programmes }: SchoolProgrammeListProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const visibleProgrammes = programmes.slice(0, visibleCount);
  const hasMore = visibleProgrammes.length < programmes.length;

  return (
    <Stack gap={4}>
      <Stack as="ul" gap={{ base: 4, md: 6 }} listStyleType="none">
        {visibleProgrammes.map((programme) => (
          <Box as="li" key={`${programme.name}\0${programme.koulutusala}`}>
            <CutoffCard headingLevel={headingLevel} programme={programme} showRound />
          </Box>
        ))}
      </Stack>
      <Stack align="center" gap={2}>
        <Text aria-live="polite" color="fg.muted" fontSize="xs">
          Näytetään {visibleProgrammes.length} / {programmes.length}
        </Text>
        {hasMore ? (
          <Button
            onClick={() => setVisibleCount((count) => Math.min(count + BATCH_SIZE, programmes.length))}
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
