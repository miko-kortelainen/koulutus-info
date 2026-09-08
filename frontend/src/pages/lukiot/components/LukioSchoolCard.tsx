import { Card, HStack, Stack, Text } from "@chakra-ui/react";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import { keskiarvoFormat } from "@/pages/lukiot/lib/formatKeskiarvo";
import { COLORS } from "@/theme";

interface LukioSchoolCardProps {
  koulu: string;
  entries: LukioKeskiarvoEntry[];
}

interface LinjaRowProps {
  entry: LukioKeskiarvoEntry;
}

function LinjaRow({ entry }: LinjaRowProps) {
  return (
    <Stack
      alignItems={{ base: "flex-start", md: "center" }}
      borderBottom={`1px solid ${COLORS.accentFg}`}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 1, md: 6 }}
      justify="space-between"
      py={1}
    >
      <Text flex={7} fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" letterSpacing="wide" textWrap="pretty">
        {entry.linja}
      </Text>
      <HStack flex={3} justify={{ base: "space-between", md: "flex-end" }} width="100%">
        <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }} letterSpacing="wide" mr="auto">
          Alin hyväksytty
        </Text>
        <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="bold" letterSpacing="wide">
          {keskiarvoFormat.format(entry.alinKeskiarvo)}
        </Text>
      </HStack>
    </Stack>
  );
}

export default function LukioSchoolCard({ koulu, entries }: LukioSchoolCardProps) {
  return (
    <Card.Root aria-label={`${koulu} keskiarvot ${LUKIO_KESKIARVOT_YEAR}`} as="article" size="md">
      <Card.Body>
        <Stack gap={1}>
          {entries.map((entry) => (
            <LinjaRow entry={entry} key={entry.linja} />
          ))}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
