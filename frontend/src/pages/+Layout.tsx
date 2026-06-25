import { Flex, Box } from "@chakra-ui/react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex minHeight="100dvh" direction="column">
      <Header />
      <Box as="main" flex={1} display="flex" flexDirection="column">
        {children}
      </Box>
      <Footer />
    {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
</Flex>
  );
}
