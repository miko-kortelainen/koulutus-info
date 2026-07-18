import { Card, HStack, Link, Text } from "@chakra-ui/react";
import type { IconType } from "react-icons";
import { COLORS } from "@/theme";

interface QuickLinkCardProps {
  href: string;
  label: string;
  description: string;
  icon: IconType;
}

export default function QuickLinkCard({ href, label, description, icon: Icon }: QuickLinkCardProps) {
  return (
    <Card.Root alignItems="start" asChild borderColor={COLORS.accentFg} size="sm">
      <Link _hover={{ textDecoration: "none" }} href={href}>
        <Card.Body width="100%">
          <HStack gap={2}>
            <Icon color={COLORS.accentFg} size="1rem" />
            <Text fontWeight="semibold" letterSpacing="wide">
              {label}
            </Text>
          </HStack>
          <Text
            color="fg.muted"
            fontSize="sm"
            textDecor="underline"
            textDecorationColor={COLORS.accentFg}
            textDecorationStyle="dotted"
          >
            {description}
          </Text>
        </Card.Body>
      </Link>
    </Card.Root>
  );
}
