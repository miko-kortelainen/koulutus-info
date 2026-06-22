import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import StatsListPage from "./features/stats/components/StatsListPage";
import SchoolsListPage from "./features/schools/SchoolsListPage";

function App() {
  return (
    <>
      <Flex height="100dvh" direction="column">
        <Header />
        <Box flex={1}>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="/hakijamaarat" element={<StatsListPage />} />
            <Route path="/koulutukset" element={<SchoolsListPage />} />
          </Routes>
        </Box>

        <Footer />
      </Flex>
    </>
  );
}

export default App;
