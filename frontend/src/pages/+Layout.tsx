import { Box, Flex } from "@chakra-ui/react";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex bg="bg" color="fg" direction="column" minH="100svh">
      <Header />
      <Box as="main" display="flex" flexDirection="column" flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
}
