import { Card, Heading } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface TrendCardProps {
  title: string;
  color: string;
  children: ReactNode;
}

export default function TrendCard({ title, color, children }: TrendCardProps) {
  return (
    <Card.Root borderLeftColor={color} borderLeftWidth="4px" variant="outline">
      <Card.Body gap={4}>
        <Heading as="h2" size="sm">
          {title}
        </Heading>
        {children}
      </Card.Body>
    </Card.Root>
  );
}
