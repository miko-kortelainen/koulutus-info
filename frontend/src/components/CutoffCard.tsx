import { Card, Heading, HStack, Separator, Stack, Text } from "@chakra-ui/react";
import type { ProgrammeWithRounds } from "@/api/cutoffs";
import { cutoffRoundShortLabel } from "@/config/cutoffRounds";
import { COLORS } from "@/theme";

interface CutoffCardProps {
  programme: ProgrammeWithRounds;
  headingLevel?: "h2" | "h3";
  showRound?: boolean;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  maximumFractionDigits: 2,
});

interface CutoffRowProps {
  cutoff: ProgrammeWithRounds["cutoffs"][number];
  showRound: boolean;
}

function CutoffRow({ cutoff, showRound }: CutoffRowProps) {
  return (
    <Stack
      alignItems={{ base: "flex-start", md: "center" }}
      borderBottom={`1px solid ${COLORS.accentFg}`}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 1, md: 6 }}
      justify="space-between"
      py={1}
    >
      <Stack flex={7} gap={0}>
        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" letterSpacing="wide" textWrap="pretty">
          {cutoff.selectionMethod}
        </Text>
        {showRound ? (
          <Text color="fg.muted" fontSize="xs" letterSpacing="wide">
            {cutoffRoundShortLabel(cutoff.round)}
          </Text>
        ) : null}
      </Stack>

      <HStack flex={3} justify={{ base: "space-between", md: "flex-end" }} width="100%">
        <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }} letterSpacing="wide" mr="auto">
          Alin hyväksytty pistemäärä
        </Text>
        <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" letterSpacing="wide">
          {scoreFormatter.format(cutoff.score)}
        </Text>
      </HStack>
    </Stack>
  );
}

export default function CutoffCard({ programme, headingLevel = "h2", showRound = false }: CutoffCardProps) {
  const sorted = [...programme.cutoffs].sort(
    (a, b) => b.startYear - a.startYear || b.startSeason.localeCompare(a.startSeason, "fi"),
  );

  return (
    <Card.Root as="article" size="md">
      <Card.Header pb={3}>
        <Heading as={headingLevel} fontSize={{ base: "xs", md: "md" }} fontWeight="semibold" textWrap="pretty">
          {programme.name}
        </Heading>
        <Separator />
      </Card.Header>
      <Card.Body pt={0}>
        <Stack gap={1}>
          {sorted.map((cutoff) => (
            <CutoffRow
              cutoff={cutoff}
              key={`${cutoff.selectionMethod}-${cutoff.round}-${cutoff.startYear}-${cutoff.startSeason}-${cutoff.score}`}
              showRound={showRound}
            />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
