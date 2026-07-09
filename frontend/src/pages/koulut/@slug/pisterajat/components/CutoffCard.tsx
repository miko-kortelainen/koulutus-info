import { Badge, Card, HStack, Stack, Text } from "@chakra-ui/react";
import { COLORS } from "@/theme";
import type { Programme as CutoffProgramme, SelectionMethod } from "@/types/pisterajat.gen";

interface CutoffCardProps {
  programme: CutoffProgramme;
}

const scoreFormatter = new Intl.NumberFormat("fi-FI", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const selectionMethodBlock = (selectionMethod: SelectionMethod) => (
  <Stack gap={2} key={selectionMethod.name}>
    <Badge bg={COLORS.accent} color={COLORS.text} fontWeight="semibold" size={{ base: "sm", md: "lg" }} width="fit">
      {selectionMethod.name}
    </Badge>
    {selectionMethod.cutoffs.map((cutoff, index) => (
      <HStack alignItems="flex-start" gap={4} justify="space-between" key={index}>
        <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }} textWrap="pretty">
          {cutoff.detail}
        </Text>
        <Text flexShrink="0" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {scoreFormatter.format(cutoff.score)}
        </Text>
      </HStack>
    ))}
  </Stack>
);

export default function CutoffCard({ programme }: CutoffCardProps) {
  return (
    <Card.Root size="md">
      <Card.Header>
        <Text as="h2" fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" mb={-2} textWrap="pretty">
          {programme.name}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack gap={3}>{programme.selectionMethods.map(selectionMethodBlock)}</Stack>
      </Card.Body>
    </Card.Root>
  );
}
