import { Card, HStack, Separator, Stack, Text } from "@chakra-ui/react";
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
      direction={{ base: "column", md: "row" }}
      gap={{ base: 2, md: 6 }}
      justify="space-between"
      py={{ base: 3, md: 4 }}
    >
      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" letterSpacing="wide" textWrap="pretty" flex={7}>
        {cutoff.selectionMethod}
      </Text>

      <HStack align="center" justify={{ base: "space-between", md: "flex-end" }} flex={3}>
        <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }} letterSpacing="wide" mr="auto">
          Alin hyväksytty pistemäärä
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold" letterSpacing="wide">
          {scoreFormatter.format(cutoff.score)}
        </Text>
      </HStack>
    </Stack>
  );
}

export default function CutoffCard({ programme }: CutoffCardProps) {
  const cutoffList = programme.cutoffs.map((cutoff) => (
    <>
      <CutoffRow cutoff={cutoff} key={`${cutoff.selectionMethod}-${cutoff.score}`} />
      <Separator mt={-7} />
    </>
  ));

  return (
    <Card.Root as="article" size="md">
      <Card.Header pb={3}>
        <Text as="h2" fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" textWrap="pretty">
          {programme.name}
        </Text>
      </Card.Header>
      <Card.Body pt={0}>
        <Stack gap={3}>{cutoffList}</Stack>
      </Card.Body>
    </Card.Root>
  );
}
