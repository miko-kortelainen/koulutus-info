import { Badge, Box, Button, Card, Center, Group, Heading, Separator, Stack } from "@chakra-ui/react";
import { HiLocationMarker, HiChartBar } from "react-icons/hi";
import type { DegreeData } from "./types/degree";
import DegreeCard from "./DegreeCard";

type Props = {
  interests: [string, number][];
  degreeData: DegreeData[];
  selectedDegree?: DegreeData[];
  onShowMore: (degreeData: DegreeData[]) => void;
};

export default function ResultsPage({ interests, degreeData, selectedDegree, onShowMore }: Props) {
  const ListOfSchools = selectedDegree?.map((d, index) => (
    // school card component
    <Card.Root key={`${d.hakukohde}, ${d.toimipiste}, ${index}`}>
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
          {/* https://opintopolku.fi/konfo/fi/haku/XXXX?koulutustyyppi=amk-alempi */}
          <Button size={"xs"} variant={"outline"} asChild>
            <a href={`https://opintopolku.fi/konfo/fi/haku/${d.hakukohde}?koulutustyyppi=amk-alempi`}>
              Etsi opintopolusta
            </a>
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  ));

  return (
    <Center h="100vh" px={8}>
      <Stack direction="row" w="1000px" alignItems="center">
        <Box width="100%">
          <Heading textAlign="center" size="3xl" pb={4}>
            Sinulle sopivat alat
          </Heading>
          <Separator mb={6} />

          <Stack px={4} gap={6} h="900px" overflow="scroll" overflowX="hidden">
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

        <Box width="100%">
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
