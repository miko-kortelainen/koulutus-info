import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { system } from "@/theme";

export function renderWithChakra(children: ReactNode) {
  return render(<ChakraProvider value={system}>{children}</ChakraProvider>);
}
