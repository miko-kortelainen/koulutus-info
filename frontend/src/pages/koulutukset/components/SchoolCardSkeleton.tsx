import { Card, HStack, Skeleton, Stack } from "@chakra-ui/react";

export default function SchoolCardSkeleton() {
  return (
    <Card.Root size="md">
      <Card.Header>
        <Skeleton height="16px" width="180px" />
      </Card.Header>
      <Card.Body>
        <Stack>
          <Skeleton height="24px" width="140px" />

          <HStack justify="space-between">
            <Skeleton height="16px" width="100px" />
            <Skeleton height="24px" width="24px" />
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
