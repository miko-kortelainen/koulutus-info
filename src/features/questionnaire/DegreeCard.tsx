import { Button, Card, Heading, Stack } from "@chakra-ui/react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { type DegreeData } from "./types/degree";

type Props = {
  tutkintonimike: string;
  score?: number;
  degreeData: DegreeData[];
};

export default function DegreeCard({ tutkintonimike, degreeData }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Stack direction="row">
          <Heading mr={"auto"}>{tutkintonimike}</Heading>
          <Button size="xs" variant="outline">
            Tutustu <HiOutlineInformationCircle />
          </Button>
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack>
          {/* {degreeData.map((d, i) => (
            <Text key={i}>{d.hakukohde}</Text>
          ))} */}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
