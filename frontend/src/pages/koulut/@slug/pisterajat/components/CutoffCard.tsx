import { Card, HStack, Separator, Stack, Text } from "@chakra-ui/react";
import { COLORS } from "@/theme";
import type { Programme as CutoffProgramme } from "@/types/pisterajat.gen";

interface CutoffCardProps {
  programme: CutoffProgramme;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface CutoffRowProps {
  cutoff: CutoffProgramme["cutoffs"][number];
}

function CutoffRow({ cutoff }: CutoffRowProps) {
  return (
    <Stack
      alignItems={{ base: "flex-start", md: "center" }}
      borderBottom={`1px solid ${COLORS.accent}`}
      direction={{ base: "column", md: "row" }}
      gap={{ base: 1, md: 6 }}
      justify="space-between"
      py={1}
    >
      <Text flex={7} fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" letterSpacing="wide" textWrap="pretty">
        {cutoff.selectionMethod}
      </Text>

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

export default function CutoffCard({ programme }: CutoffCardProps) {
  const cutoffList = programme.cutoffs.map((cutoff) => (
    <CutoffRow cutoff={cutoff} key={`${cutoff.selectionMethod}-${cutoff.score}`} />
  ));

  return (
    <Card.Root as="article" size="md">
      <Card.Header pb={3}>
        <Text as="h2" fontSize={{ base: "xs", md: "md" }} fontWeight="semibold" textWrap="pretty">
          {programme.name}
        </Text>
        <Separator />
      </Card.Header>
      <Card.Body pt={0}>
        <Stack gap={{ base: 6, md: 8 }}>{cutoffList}</Stack>
      </Card.Body>
    </Card.Root>
  );
}
