import { ChakraProvider } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { ColorModeProvider } from "@/components/color-mode";
import { system } from "@/theme";

export function renderWithChakra(children: ReactNode) {
  return render(
    <ChakraProvider value={system}>
      <ColorModeProvider defaultTheme="light" enableSystem={false}>
        {children}
      </ColorModeProvider>
    </ChakraProvider>,
  );
}
