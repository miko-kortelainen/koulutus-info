import { Card, Stack, Group, Skeleton } from "@chakra-ui/react";

export default function DegreeStatsCardSkeleton() {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Skeleton height="16px" width="180px" />
      </Card.Header>
      <Card.Body>
        <Stack>
          <Skeleton height="16px" width="120px" />

          <Group>
            <Skeleton height="17px" width="80px" />

            <Skeleton height="17px" width="100px" />
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
