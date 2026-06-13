import { Card, Stack, Text } from "@chakra-ui/react";
import { type KoulutusEntry } from "../../../types.gen";

type Props = {
  school: KoulutusEntry;
};

export default function SchoolCard({ school }: Props) {
  return (
    <Card.Root>
      <Card.Header textWrap="pretty">{school.nimi.fi}</Card.Header>
      <Card.Body>
        <Stack>
          <Text>Toteutuksien määrä: {school.toteutukset.length}</Text>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
