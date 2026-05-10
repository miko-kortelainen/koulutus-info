import { Box, Center, Heading, Progress, Stack } from "@chakra-ui/react";
import QuestionnaireCard from "./QuestionnaireCard";
import { useState } from "react";
import { type BasicDegreeData, type DegreeData } from "./types/degree";

import questionsJson from "./koulutukset.json";
import degreeDataJson from "./questions.json";
import DegreeCard from "./DegreeCard";

const questions: BasicDegreeData[] = questionsJson;
const degreeData: DegreeData[] = degreeDataJson;

export default function QuestionnairePage() {
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
      <Center h="100vh" px={8}>
        <Stack>
          <Heading textAlign="center">Sinulle sopivat alat ovat:</Heading>
          <Box maxH="900px" overflow="scroll">
            <Stack px={5}>
              {ranked.map(([tutkintonimike, score]) => {
                // Etsitään kaikki ne kohteet, joiden hakukohde-kenttä sisältää tutkintonimikkeen
                const filteredData = degreeData.filter((item) =>
                  item.hakukohde.toLowerCase().includes(tutkintonimike.toLowerCase()),
                );

                return (
                  <DegreeCard
                    key={tutkintonimike}
                    tutkintonimike={tutkintonimike}
                    score={score}
                    // Passataan suodatettu lista propseina (jos DegreeCard ottaa vastaan listan)
                    degreeData={filteredData}
                  />
                );
              })}
            </Stack>
          </Box>
        </Stack>
      </Center>
    );
  }

  return (
    <Center h="100vh" px={8}>
      <Stack gap={4} maxWidth={"700px"}>
        <QuestionnaireCard degree={currentQuestion} onAnswer={(a) => handleNextQuestion(a)} />
        <Box opacity={currentQuestionIndex > 0 ? "75%" : "0%"} transition={"opacity 500ms ease-out"}>
          {progressBar}
        </Box>
      </Stack>
    </Center>
  );
}
