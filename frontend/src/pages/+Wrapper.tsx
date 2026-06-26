import { ChakraProvider, Theme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { system } from "../theme";

const queryClient = new QueryClient();

export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider value={system}>
        <Theme appearance="dark">{children}</Theme>
      </ChakraProvider>
    </QueryClientProvider>
  );
}
