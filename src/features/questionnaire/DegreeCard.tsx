import { Button, Card, Heading, Stack } from "@chakra-ui/react";
import { HiChevronRight } from "react-icons/hi";
import { type DegreeData } from "./types/degree";

type Props = {
  tutkintonimike: string;
  score?: number;
  degreeData: DegreeData[];
  onShowMore: (degreeData: DegreeData[]) => void;
};

export default function DegreeCard({ tutkintonimike, degreeData, onShowMore }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Stack direction="row">
          <Heading mr={"auto"}>{tutkintonimike}</Heading>
          <Button size="xs" variant="outline" onClick={() => onShowMore(degreeData)}>
            Koulutukset <HiChevronRight />
          </Button>
        </Stack>
      </Card.Header>
      <Card.Body></Card.Body>
    </Card.Root>
  );
}
