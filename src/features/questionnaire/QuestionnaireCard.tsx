import { Card, Text, Button, Heading, Stack, Stat, Badge } from "@chakra-ui/react";

import { HiOutlineArrowSmDown, HiOutlineArrowSmUp, HiLocationMarker } from "react-icons/hi";
import { type DegreeData } from "./types/degree";

type Props = {
  degree: DegreeData;
  onAnswer: (answer: "no" | "yes" | "maybe") => void;
};

const ApplicantsAmount = ({ applicants }: { applicants: number }) => (
  <Stat.Root size="sm">
    <Stat.Label>Kaikki hakijat</Stat.Label>
    <Stat.ValueText>{applicants}</Stat.ValueText>
  </Stat.Root>
);

const FirstChoiceApplicantsAmount = ({ applicants }: { applicants: number }) => (
  <Stat.Root size="sm">
    <Stat.Label>Ensisijaiset hakijat</Stat.Label>
    <Stat.ValueText>{applicants}</Stat.ValueText>
  </Stat.Root>
);

const SpotsAmount = ({ spots }: { spots: number }) => (
  <Stat.Root size="sm">
    <Stat.Label>Aloituspaikat</Stat.Label>
    <Stat.ValueText>{spots}</Stat.ValueText>
  </Stat.Root>
);

export default function QuestionnaireCard({ degree, onAnswer }: Props) {
  return (
    <Card.Root variant="elevated" p={4} textAlign="center" width={"600px"}>
      <Card.Body>
        <Stack gap={4}>
          <Stack gap={3} textAlign="left">
            <Heading size="2xl" textWrap={"balance"}>
              {degree.title}
            </Heading>

            <Badge size={"md"} width={"fit"}>
              <HiLocationMarker /> {degree.kuntaHakukohde}
            </Badge>

            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
              {degree.description}
            </Text>
          </Stack>

          <Stack direction="row" textWrap={"nowrap"} width={"fit-content"} gap={6}>
            <ApplicantsAmount applicants={degree.kaikkiHakijatLkm} />
            <FirstChoiceApplicantsAmount applicants={degree.ensisijaisetHakijatLkm} />
            <SpotsAmount spots={degree.aloituspaikatLkm} />
          </Stack>
        </Stack>
      </Card.Body>

      <Card.Footer>
        <Stack flex={1} gap={4}>
          <Stack direction="row" gap={4}>
            <Button flex={1} onClick={() => onAnswer("no")} colorPalette={"red"}>
              Ei kiitos <HiOutlineArrowSmDown />
            </Button>
            <Button flex={1} onClick={() => onAnswer("yes")} colorPalette={"green"}>
              Jatkoon! <HiOutlineArrowSmUp />
            </Button>
          </Stack>
          <Button variant="surface" onClick={() => onAnswer("maybe")}>
            En osaa sanoa
          </Button>
        </Stack>
      </Card.Footer>
    </Card.Root>
  );
}
