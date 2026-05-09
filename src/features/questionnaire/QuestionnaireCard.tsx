import { Card, Text, Button, Heading, Stack } from "@chakra-ui/react";
import { HiOutlineArrowSmDown, HiOutlineArrowSmUp } from "react-icons/hi";

type Props = {
  title: string;
  description: string;
  onAnswer: (answer: "no" | "yes" | "maybe") => void;
};

export default function QuestionnaireCard({ title, description, onAnswer }: Props) {
  return (
    <Card.Root variant="elevated" p={4} textAlign="center" width={"600px"}>
      <Card.Body>
        <Stack gap={2} textAlign="left">
          <Heading size="2xl">{title}</Heading>
          <Text>{description}</Text>
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
