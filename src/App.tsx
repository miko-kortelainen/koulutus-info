import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import QuestionnairePage from "./features/questionnaire/QuestionnairePage";
import { Box, Flex } from "@chakra-ui/react";
import Footer from "./layout/Footer";

function App() {
  return (
    <>
      <Flex height="100dvh" direction="column">
        <Box flex={1}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/questionnaire" element={<QuestionnairePage />} />
          </Routes>
        </Box>

        <Footer />
      </Flex>
    </>
  );
}

export default App;
