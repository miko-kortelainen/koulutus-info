import { Badge, Button, Card, Group } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type ToteutusEntry } from "../../../types.gen";

type Props = {
  toteutus: ToteutusEntry;
};

export default function SchoolCard({ toteutus }: Props) {
  const toteutusURL = `https://opintopolku.fi/konfo/fi/toteutus/${toteutus.toteutusOid}`;

  return (
    <Card.Root>
      <Card.Header textWrap="pretty">{toteutus.toteutusNimi.fi}</Card.Header>
      <Card.Body>
        <Group alignItems="flex-end">
          <Badge colorPalette="green" mr="auto">
            <HiLocationMarker /> {toteutus.oppilaitosNimi.fi}
          </Badge>

          <Button size="xs" variant="outline">
            <a href={toteutusURL} target="_blank">
              Katso opintopolussa
            </a>
          </Button>
        </Group>
      </Card.Body>
    </Card.Root>
  );
}
