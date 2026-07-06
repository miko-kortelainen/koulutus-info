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
    <Card.Root size="sm" asChild alignItems="start" borderColor={COLORS.accent}>
      <Link href={href} _hover={{ textDecoration: "none" }}>
        <Card.Body width="100%">
          <HStack gap={2}>
            <Icon size="1rem" color={COLORS.accent} />
            <Text fontWeight="semibold" letterSpacing="wide">
              {label}
            </Text>
          </HStack>
          <Text
            fontSize="sm"
            color="fg.muted"
            textDecor="underline"
            textDecorationStyle="dotted"
            textDecorationColor={COLORS.accent}
          >
            {description}
          </Text>
        </Card.Body>
      </Link>
    </Card.Root>
  );
}
