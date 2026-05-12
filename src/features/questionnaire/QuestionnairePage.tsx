import { useState } from "react";
import { Box, Center, Progress, Stack } from "@chakra-ui/react";
import { type BasicDegreeData, type DegreeData } from "./types/degree";
import QuestionnaireCard from "./QuestionnaireCard";
import ResultsPage from "./ResultsPage";

import questionsJson from "./koulutukset.json";
import degreeDataJson from "./questions.json";

const questions: BasicDegreeData[] = questionsJson;
const degreeData: DegreeData[] = degreeDataJson;

export default function QuestionnairePage() {
  const [selectedDegree, setSelectedDegree] = useState<DegreeData[] | undefined>();
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[currentQuestionIndex];
  const [scores, setScores] = useState<Record<string, number>>({});

  function handleNextQuestion(a: "yes" | "no" | "maybe") {
    const { koulutus } = currentQuestion;

    setScores((prev) => ({
      ...prev,
      [koulutus]: (prev[koulutus] ?? 0) + (a === "yes" ? 2 : a === "maybe" ? 1 : -1),
    }));

    if (currentQuestionIndex === questions.length - 1) {
      setAllQuestionsAnswered(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  const QuestionsProgress = (
    <Progress.Root value={(currentQuestionIndex / questions.length) * 100}>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
      <Progress.Label />
      <Progress.ValueText />
    </Progress.Root>
  );

  if (allQuestionsAnswered) {
    // degrees what user deemed as interesting.
    const interests = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0);

    return (
      <ResultsPage
        degreeData={degreeData}
        interests={interests}
        selectedDegree={selectedDegree}
        onShowMore={(degreeData) => setSelectedDegree(degreeData)}
      />
    );
  }

  return (
    <Center h="100vh" px={8} overflow={"hidden"}>
      <Stack gap={4} maxWidth="700px" width="100%">
        <QuestionnaireCard degree={currentQuestion} onAnswer={(a) => handleNextQuestion(a)} />
        <Box opacity={currentQuestionIndex > 0 ? "75%" : "0%"} transition={"opacity 500ms ease-out"}>
          {QuestionsProgress}
        </Box>
      </Stack>
    </Center>
  );
}
