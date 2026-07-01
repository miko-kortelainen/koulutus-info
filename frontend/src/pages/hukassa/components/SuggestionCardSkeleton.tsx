import { COLORS } from "@/theme";
import { Card, Stack, Skeleton } from "@chakra-ui/react";

export default function SuggestionCardSkeleton() {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Skeleton height="16px" width="240px" bg={COLORS.border} />
      </Card.Header>
      <Card.Body>
        <Stack gap={5}>
          <Skeleton height="12px" width="100%" bg={COLORS.border} />
          <Skeleton height="15px" width="125px" bg={COLORS.border} />
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
