import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { COLORS } from "@/theme";

interface PageIntroProps {
  title: ReactNode;
  description: ReactNode;
}

export default function PageIntro({ title, description }: PageIntroProps) {
  return (
    <Flex
      alignItems="center"
      as="header"
      backgroundImage={`linear-gradient(to bottom, color-mix(in srgb, ${COLORS.accent} 16%, ${COLORS.bg}), ${COLORS.bg})`}
      justifyContent="center"
      mb={{ base: 6, md: 10 }}
      minH={{ base: "184px", md: "192px" }}
      px={{ base: 4, md: 6 }}
      py={{ base: 8, md: 0 }}
    >
      <Stack alignItems="start" gap={1} width={{ base: "100%", md: "60rem" }}>
        <Heading
          as="h1"
          fontSize={{ base: "28px", md: "40px" }}
          fontWeight="semibold"
          lineHeight="44px"
          textWrap="balance"
        >
          {title}
        </Heading>
        <Text color="fg.muted" fontSize={{ base: "14px", md: "18px" }} lineHeight="27px" textWrap="pretty">
          {description}
        </Text>
      </Stack>
    </Flex>
  );
}
