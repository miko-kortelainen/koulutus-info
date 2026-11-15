import { Badge, Card, Heading, HStack, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { cutoffRoundShortLabel } from "@/config/cutoffRounds";
import type { ProgrammeWithRounds } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";
import { COLORS } from "@/theme";

interface CutoffCardProps {
  programme: ProgrammeWithRounds;
  headingLevel?: "h2" | "h3";
  showHeading?: boolean;
  showRound?: boolean;
  schoolName?: string;
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

export default function CutoffCard({
  programme,
  headingLevel = "h2",
  showHeading = true,
  showRound = false,
  schoolName,
}: CutoffCardProps) {
  const sorted = [...programme.cutoffs].sort(
    (a, b) => b.startYear - a.startYear || b.startSeason.localeCompare(a.startSeason, "fi"),
  );

  return (
    <Card.Root as="article" size="md">
      {showHeading ? (
        <Card.Header pb={4}>
          <Stack gap={2}>
            {schoolName ? (
              <Link
                alignSelf="flex-start"
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight="semibold"
                href={`/koulut/${slugify(schoolName)}/`}
                textDecor="none"
              >
                <Badge bg="accent" color="onAccent" size="sm">
                  <HiLocationMarker aria-hidden="true" /> {schoolName}
                </Badge>
              </Link>
            ) : null}
            <Heading
              as={headingLevel}
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="semibold"
              lineHeight="moderate"
              textWrap="pretty"
            >
              {programme.name}
            </Heading>
          </Stack>
        </Card.Header>
      ) : null}
      <Card.Body pt={showHeading ? 0 : undefined}>
        <Stack>
          {showHeading ? <Separator /> : null}
          <Stack gap={1}>
            {sorted.map((cutoff) => (
              <CutoffRow
                cutoff={cutoff}
                key={`${cutoff.selectionMethod}-${cutoff.round}-${cutoff.startYear}-${cutoff.startSeason}-${cutoff.score}`}
                showRound={showRound}
              />
            ))}
          </Stack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
