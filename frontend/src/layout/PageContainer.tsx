import { Flex, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  align?: "center" | "flex-start";
}

export default function PageContainer({ children, align = "center" }: PageContainerProps) {
  return (
    <Flex align={align} flex={1} justify="center" px={{ base: 4, md: 6 }}>
      <Stack direction="column" gap={4} height="100%" py={2} width={{ base: "100%", md: "60rem" }}>
        {children}
      </Stack>
    </Flex>
  );
}
