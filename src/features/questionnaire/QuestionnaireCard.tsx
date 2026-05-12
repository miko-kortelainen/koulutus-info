import { Card, Text, Button, Heading, Stack, Badge } from "@chakra-ui/react";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";

import { type BasicDegreeData } from "./types/degree";

type Props = {
  degree: BasicDegreeData;
  onAnswer: (answer: "no" | "yes" | "maybe") => void;
};

export default function QuestionnaireCard({ degree, onAnswer }: Props) {
  const DegreeTags = (
    <Stack direction="row" gap={4} flexWrap={"wrap"}>
      {degree.tags.map((tag) => (
        <Badge key={tag} size="lg" width="fit" colorPalette={"cyan"}>
          {tag}
        </Badge>
      ))}
    </Stack>
  );

  return (
    <Card.Root variant="elevated" p={4} textAlign="center" gap={2}>
      <Card.Header textAlign="left">
        <Heading size="2xl" textWrap={"balance"}>
          {degree.title}
        </Heading>
      </Card.Header>
      <Card.Body>
        <Stack gap={4} textAlign="left">
          <Text textWrap={"pretty"} whiteSpace={"pre-line"}>
            {degree.description}
          </Text>
          {DegreeTags}
        </Stack>
      </Card.Body>

      <Card.Footer>
        <Stack flex={1} gap={6}>
          <Stack direction="row" gap={6}>
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
