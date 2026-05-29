import { Box, Center, Heading, Separator, Stack } from "@chakra-ui/react";
import type { DegreeData } from "./types/degree";
import DegreeCard from "./DegreeCard";
import SchoolCard from "./SchoolCard";

type Props = {
  interests: [string, number][];
  degreeData: DegreeData[];
  selectedDegree?: DegreeData[];
  onShowMore: (degreeData: DegreeData[]) => void;
};

export default function ResultsPage({ interests, degreeData, selectedDegree, onShowMore }: Props) {
  const ListOfSchools = selectedDegree?.map((d, index) => (
    <SchoolCard degree={d} key={`${d.hakukohde}, ${d.toimipiste}, ${index}`} />
  ));

  return (
    <Center h="100%" px={8}>
      <Stack direction="row" w="1000px" alignItems="center">
        <Box width="100%">
          <Heading textAlign="center" size="3xl" pb={4}>
            Sinulle sopivat alat
          </Heading>
          <Separator mb={6} />

          <Stack px={4} gap={6} h="900px" overflow="scroll" overflowX="hidden" data-cy="results-list">
            {interests.map(([tutkintonimike, score]) => {
              const filteredData = degreeData.filter((item) =>
                item.hakukohde.toLowerCase().includes(tutkintonimike.toLowerCase()),
              );

              return (
                <DegreeCard
                  key={tutkintonimike}
                  tutkintonimike={tutkintonimike}
                  score={score}
                  degreeData={filteredData}
                  onShowMore={onShowMore}
                />
              );
            })}
          </Stack>
        </Box>

        <Separator orientation="vertical" height="980px" />

        <Box width="100%" data-cy="results-page">
          <Heading textAlign="center" size="3xl" pb={4}>
            Koulutukset
          </Heading>
          <Separator mb={6} />

          <Stack px={4} gap={6} h="900px" overflow="scroll" overflowX="hidden">
            {ListOfSchools}
          </Stack>
        </Box>
      </Stack>
    </Center>
  );
}
