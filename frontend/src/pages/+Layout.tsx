import { Flex, Box } from "@chakra-ui/react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex height="100dvh" direction="column">
      <Header />
      <Box as="main" flex={1}>{children}</Box>
      <Footer />
    </Flex>
  );
}
