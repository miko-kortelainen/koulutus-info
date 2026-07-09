import { Box, Flex } from "@chakra-ui/react";
import Footer from "../layout/Footer";
import Header from "../layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" minHeight="100svh">
      <Header />
      <Box as="main" display="flex" flex="1" flexDirection="column">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
