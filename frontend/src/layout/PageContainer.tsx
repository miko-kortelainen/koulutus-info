import { Center, Stack } from "@chakra-ui/react";
import type { ReactNode } from "react";

export default function PageContainer({ children }: { children: ReactNode }) {
  return (
    <Center flex={1} px={{ base: 4, md: 6 }}>
      <Stack height="100%" direction="column" gap={4} py={2} width={{ base: "100%", md: "60rem" }}>
        {children}
      </Stack>
    </Center>
  );
}
