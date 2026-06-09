import { Card, Stack, Badge, Group, Skeleton } from "@chakra-ui/react";

export default function DegreeStatsCardSkeleton() {
  return (
    <Card.Root>
      <Card.Header>
        <Skeleton height="24px" width="80%" />
      </Card.Header>
      <Card.Body>
        <Stack>
          <Badge mr="auto" p={0}>
            <Skeleton height="16px" width="120px" />
          </Badge>

          <Group>
            <Badge p={0}>
              <Skeleton height="16px" width="80px" />
            </Badge>

            <Badge p={0}>
              <Skeleton height="16px" width="100px" />
            </Badge>
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
