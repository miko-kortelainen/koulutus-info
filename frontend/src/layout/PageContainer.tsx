import { Center, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Center h="100%" px={{ base: 2, md: 4 }}>
      <Stack height="100%" direction="column" gap={4} p={2} width={{ base: "100%", md: "60rem" }}>
        {children}
      </Stack>
    </Center>
  );
}
