import { ChakraProvider, defaultSystem, Theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={defaultSystem}>
        <Theme appearance="dark">{children}</Theme>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
