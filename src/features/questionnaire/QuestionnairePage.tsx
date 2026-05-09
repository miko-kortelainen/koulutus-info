import { Box, Center, Heading, Progress, Stack, Text } from "@chakra-ui/react";
import QuestionnaireCard from "./QuestionnaireCard";
import { useState } from "react";
import { type DegreeData } from "./types/degree";

import questionsJson from "./questions.json";
const questions: DegreeData[] = questionsJson;

export default function QuestionnairePage() {
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[currentQuestionIndex];

  const [scores, setScores] = useState<Record<string, number>>({});

  function handleNextQuestion(a: "yes" | "no" | "maybe") {
    const { paaasiallinenTutkintoHakukohde } = currentQuestion;

    setScores((prev) => ({
      ...prev,
      [paaasiallinenTutkintoHakukohde]:
        (prev[paaasiallinenTutkintoHakukohde] ?? 0) + (a === "yes" ? 2 : a === "maybe" ? 1 : -1),
    }));

    if (currentQuestionIndex === questions.length - 1) {
      setAllQuestionsAnswered(true);
      return;
    }

    setCurrentQuestionIndex((prev) => prev + 1);
  }

  const progressBar = (
    <Progress.Root value={(currentQuestionIndex / questions.length) * 100}>
      <Progress.Track>
        <Progress.Range />
      </Progress.Track>
      <Progress.Label />
      <Progress.ValueText />
    </Progress.Root>
  );

  if (allQuestionsAnswered) {
    const ranked = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0);

    return (
      <Center h="100vh">
        <Stack>
          <Heading>Sinulle sopivat alat ovat:</Heading>
          <Stack>
            {ranked.map(([tutkintonimike, score]) => (
              <Text key={tutkintonimike}>
                {tutkintonimike} : {score}
              </Text>
            ))}
          </Stack>
        </Stack>
      </Center>
    );
  }

  return (
    <Center h="100vh">
      <Stack gap={4}>
        <QuestionnaireCard degree={currentQuestion} onAnswer={(a) => handleNextQuestion(a)} />
        <Box opacity={currentQuestionIndex > 0 ? "75%" : "0%"} transition={"opacity 500ms ease-out"}>
          {progressBar}
        </Box>
      </Stack>
    </Center>
  );
}
