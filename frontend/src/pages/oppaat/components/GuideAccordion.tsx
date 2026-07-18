import { Collapsible, Heading, Span } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface GuideAccordionProps {
  title: string;
  children: ReactNode;
}

// The trigger sits inside an h3 so collapsed sections keep the guide's heading outline.
export default function GuideAccordion({ title, children }: GuideAccordionProps) {
  return (
    <Collapsible.Root>
      <Heading as="h3" size="md" textWrap="balance">
        <Collapsible.Trigger
          alignItems="center"
          border="1px solid"
          borderColor="accent"
          display="flex"
          px={4}
          py={2}
          width="100%"
        >
          <Span flex="1">{title}</Span>
          <Collapsible.Indicator />
        </Collapsible.Trigger>
      </Heading>
      <Collapsible.Content p={2}>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
