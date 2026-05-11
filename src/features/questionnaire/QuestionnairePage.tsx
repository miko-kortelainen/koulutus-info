import { Badge, Box, Card, Center, Group, Progress, Separator, Stack } from "@chakra-ui/react";
import { HiLocationMarker, HiChartBar } from "react-icons/hi";
import QuestionnaireCard from "./QuestionnaireCard";
import { useState } from "react";
import { type BasicDegreeData, type DegreeData } from "./types/degree";

import questionsJson from "./koulutukset.json";
import degreeDataJson from "./questions.json";
import DegreeCard from "./DegreeCard";

const questions: BasicDegreeData[] = questionsJson;
const degreeData: DegreeData[] = degreeDataJson;

export default function QuestionnairePage() {
  const [selectedDegree, setSelectedDegree] = useState<DegreeData[] | null>();
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState<boolean>(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const currentQuestion = questions[currentQuestionIndex];
  const [scores, setScores] = useState<Record<string, number>>({});

  function handleShowDegreeInfo(degreeData: DegreeData[]) {
    setSelectedDegree(degreeData);
  }

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

  const ListOfSchoolsForDegree = selectedDegree?.map((d) => (
    <Card.Root key={d.hakukohde + d.toimipiste}>
      <Card.Header textWrap={"pretty"}>{d.hakukohde}</Card.Header>
      <Card.Body>
        <Stack>
          <Badge colorPalette={"green"} mr={"auto"}>
            <HiLocationMarker /> {d.korkeakoulu}
          </Badge>

          <Group>
            <Badge colorPalette={"blue"}>
              <HiChartBar />
              {d.kaikkiHakijatLkm} hakijaa
            </Badge>

            <Badge colorPalette={"blue"}>
              <HiChartBar />
              {d.aloituspaikatLkm} aloituspaikkaa
            </Badge>
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  ));

  if (allQuestionsAnswered) {
    const ranked = Object.entries(scores)
      .sort(([, a], [, b]) => b - a)
      .filter(([, score]) => score > 0);

    return (
      <Center h="100vh" px={8}>
        <Stack direction="row" w="1000px" alignItems={"center"}>
          <Box h="900px" overflow="scroll" width="100%">
            <Stack px={4} gap={6}>
              {ranked.map(([tutkintonimike, score]) => {
                const filteredData = degreeData.filter((item) =>
                  item.hakukohde.toLowerCase().includes(tutkintonimike.toLowerCase()),
                );

                return (
                  <DegreeCard
                    key={tutkintonimike}
                    tutkintonimike={tutkintonimike}
                    score={score}
                    degreeData={filteredData}
                    onShowMore={handleShowDegreeInfo}
                  />
                );
              })}
            </Stack>
          </Box>

          <Separator orientation="vertical" height="980px" />

          <Box h="900px" overflow="scroll" width="100%">
            <Stack px={4} gap={6}>
              {ListOfSchoolsForDegree}
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
