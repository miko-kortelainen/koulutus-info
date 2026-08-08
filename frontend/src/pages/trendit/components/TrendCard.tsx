import { Card, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface TrendCardProps {
  title: string;
  children: ReactNode;
}

export default function TrendCard({ title, children }: TrendCardProps) {
  return (
    <Card.Root variant="outline">
      <Card.Body gap={4}>
        <Heading as="h2" size="sm">
          {title}
        </Heading>
        {children}
      </Card.Body>
    </Card.Root>
  );
}
