import { Badge, Button, Card, Text, VStack } from "@chakra-ui/react";
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
    <Card.Root size="sm">
      <Card.Header>
        <Text fontSize="sm" textWrap="pretty">
          {degreeName}
        </Text>
      </Card.Header>
      <Card.Body>
        <VStack alignItems="flex-start">
          <Badge colorPalette="green" size="sm">
            <HiLocationMarker /> {schoolName}
          </Badge>

          {toteutus.toteutusOid ? (
            <Button size="2xs" variant="outline">
              <a href={toteutusURL} target="_blank">
                Katso opintopolussa
              </a>
            </Button>
          ) : null}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
