import { Badge, Button, Card, Group } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type ToteutusEntry } from "../../../types.gen";

type Props = {
  toteutus: ToteutusEntry;
};

export default function SchoolCard({ toteutus }: Props) {
  const toteutusURL = `https://opintopolku.fi/konfo/fi/toteutus/${toteutus.toteutusOid}`;
  const schoolName =
    toteutus.oppilaitosNimi.fi || toteutus.oppilaitosNimi.en || toteutus.oppilaitosNimi.sv || "virheellinen nimi";
  const degreeName =
    toteutus.toteutusNimi.fi || toteutus.toteutusNimi.en || toteutus.toteutusNimi.sv || "virheellinen nimi";

  return (
    <Card.Root>
      <Card.Header textWrap="pretty">{degreeName}</Card.Header>
      <Card.Body>
        <Group alignItems="flex-end">
          <Badge colorPalette="green" mr="auto">
            <HiLocationMarker /> {schoolName}
          </Badge>

          {toteutus.toteutusOid ? (
            <Button size="xs" variant="outline">
              <a href={toteutusURL} target="_blank">
                Katso opintopolussa
              </a>
            </Button>
          ) : null}
        </Group>
      </Card.Body>
    </Card.Root>
  );
}
