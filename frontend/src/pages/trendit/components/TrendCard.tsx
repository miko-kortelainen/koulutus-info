import type { ReactNode } from "react";
import { Card, Heading } from "@chakra-ui/react";

interface TrendCardProps {
  title: string;
  color: string;
  children: ReactNode;
}

export default function TrendCard({ title, color, children }: TrendCardProps) {
  return (
    <Card.Root variant="outline" borderLeftWidth="4px" borderLeftColor={color}>
      <Card.Body gap={4}>
        <Heading as="h2" size="sm">
          {title}
        </Heading>
        {children}
      </Card.Body>
    </Card.Root>
  );
}
