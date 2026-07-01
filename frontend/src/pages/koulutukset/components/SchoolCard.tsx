import { Badge, Card, Link, Text, VStack } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type ToteutusEntry } from "../../../types.gen";
import { COLORS } from "../../../theme";

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
    <Card.Root size="md">
      <Card.Header>
        <Text fontSize="lg" fontWeight="semibold" textWrap="balanced">
          {degreeName}
        </Text>
      </Card.Header>
      <Card.Body>
        <VStack alignItems="flex-start">
          <Badge
            bg={COLORS.accent}
            color={COLORS.text}
            fontWeight="semibold"
            letterSpacing={"wide"}
            size={{ base: "sm", md: "lg" }}
          >
            <HiLocationMarker /> {schoolName}
          </Badge>

          {toteutus.toteutusOid ? (
            <Link
              href={toteutusURL}
              target="_blank"
              rel="noopener noreferrer"
              fontSize="sm"
              textDecoration="underline"
              textDecorationStyle="dotted"
            >
              Katso opintopolussa
            </Link>
          ) : null}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
