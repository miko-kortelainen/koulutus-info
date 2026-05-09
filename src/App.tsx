import { Route, Routes } from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import QuestionnairePage from "./features/questionnaire/QuestionnairePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/questionnaire" element={<QuestionnairePage />} />
    </Routes>
  );
}

export default App;
