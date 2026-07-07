import { Flex, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  align?: "center" | "flex-start";
}

export default function PageContainer({ children, align = "center" }: PageContainerProps) {
  return (
    <Flex flex={1} justify="center" align={align} px={{ base: 4, md: 6 }}>
      <Stack height="100%" direction="column" gap={4} py={2} width={{ base: "100%", md: "60rem" }}>
        {children}
      </Stack>
    </Flex>
  );
}
