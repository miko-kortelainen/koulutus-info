import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import DegreeListPage from "./features/list/DegreeListPage";

function App() {
  return (
    <>
      <Flex height="100dvh" direction="column">
        <Header />
        <Box flex={1}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/koulutukset" element={<DegreeListPage />} />
          </Routes>
        </Box>

        <Footer />
      </Flex>
    </>
  );
}

export default App;
