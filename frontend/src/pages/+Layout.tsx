import { Box, Flex } from "@chakra-ui/react";
import FeedbackWidget from "@/layout/FeedbackWidget";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column">
      <Header />
      <Box as="main" display="flex" flexDirection="column" minHeight="100svh">
        {children}
      </Box>
      <Footer />
      <FeedbackWidget />
    </Flex>
  );
}
