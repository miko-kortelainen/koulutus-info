import { Flex, Heading, Stack, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { HEADER_HEIGHT } from "@/layout/Header";
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
      minH={{ base: `calc(184px + ${HEADER_HEIGHT})`, md: `calc(192px + ${HEADER_HEIGHT})` }}
      mt={`calc(-1 * ${HEADER_HEIGHT})`}
      pb={{ base: 8, md: 0 }}
      pt={{ base: `calc(${HEADER_HEIGHT} + 2rem)`, md: HEADER_HEIGHT }}
      px={{ base: 4, md: 6 }}
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
