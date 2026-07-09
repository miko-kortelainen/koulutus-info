import { Card, Group, Skeleton, Stack } from "@chakra-ui/react";

export default function DegreeStatsCardSkeleton() {
  return (
    <Card.Root size="lg">
      <Card.Header>
        <Skeleton height="20px" width="180px" />
      </Card.Header>
      <Card.Body>
        <Stack>
          <Skeleton height="16px" width="120px" />

          <Group>
            <Skeleton height="20px" width="80px" />

            <Skeleton height="20px" width="100px" />
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
