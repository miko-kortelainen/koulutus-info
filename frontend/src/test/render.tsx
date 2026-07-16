import { ChakraProvider, Theme } from "@chakra-ui/react";
import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { system } from "@/theme";

export function renderWithChakra(children: ReactNode) {
  return render(
    <ChakraProvider value={system}>
      <Theme appearance="light">{children}</Theme>
    </ChakraProvider>,
  );
}
