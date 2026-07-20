import { Collapsible, Heading, Span } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { HiChevronDown } from "react-icons/hi";

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
          _focusVisible={{ outline: "2px solid", outlineColor: "fg.accent", outlineOffset: "2px" }}
          _hover={{ bg: "bg.muted" }}
          alignItems="center"
          border="1px solid"
          borderColor="fg.accent"
          borderRadius="md"
          cursor="pointer"
          display="flex"
          gap={3}
          minHeight={12}
          px={4}
          py={3}
          textAlign="start"
          width="100%"
        >
          <Span flex="1">{title}</Span>
          <Collapsible.Indicator
            _open={{ transform: "rotate(180deg)" }}
            aria-hidden
            bg="accent"
            borderRadius="full"
            boxSize={8}
            color="text"
            display="grid"
            flexShrink={0}
            placeItems="center"
          >
            <HiChevronDown size="1.25rem" />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
      </Heading>
      <Collapsible.Content p={2}>{children}</Collapsible.Content>
    </Collapsible.Root>
  );
}
