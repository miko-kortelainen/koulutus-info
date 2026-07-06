import { Badge, Card, HStack, IconButton, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { HiHeart, HiLocationMarker, HiOutlineHeart } from "react-icons/hi";
import { type ToteutusEntry } from "@/types.gen";
import { COLORS } from "@/theme";
import { slugifySchoolName } from "@/components/slug";
import useFavorites from "@/hooks/useFavorites";

type Props = {
  toteutus: ToteutusEntry;
};

export default function SchoolCard({ toteutus }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(toteutus.toteutusOid);
  const toteutusURL = `https://opintopolku.fi/konfo/fi/toteutus/${toteutus.toteutusOid}`;
  const schoolName =
    toteutus.oppilaitosNimi.fi || toteutus.oppilaitosNimi.en || toteutus.oppilaitosNimi.sv || "virheellinen nimi";
  const degreeName =
    toteutus.toteutusNimi.fi || toteutus.toteutusNimi.en || toteutus.toteutusNimi.sv || "virheellinen nimi";

  const schoolBadge = (
    <Badge
      asChild
      bg={COLORS.accent}
      color={COLORS.text}
      fontWeight="semibold"
      letterSpacing="wide"
      size={{ base: "sm", md: "lg" }}
      width="fit"
    >
      <a href={`/koulut/${slugifySchoolName(schoolName)}/`}>
        <HiLocationMarker /> {schoolName}
      </a>
    </Badge>
  );

  const footer = (
    <HStack justify="space-between" alignItems="center">
      {toteutus.toteutusOid ? (
        <Link
          href={toteutusURL}
          target="_blank"
          rel="noopener noreferrer"
          fontSize="sm"
          letterSpacing="wide"
          textDecoration="underline"
          textDecorationStyle="dotted"
          textDecorationColor={COLORS.accent}
        >
          Katso opintopolussa
        </Link>
      ) : null}
      <IconButton
        height="fit"
        aria-label={favorited ? "Poista tallennetuista" : "Tallenna"}
        variant="ghost"
        size="xl"
        onClick={() => toggleFavorite(toteutus)}
      >
        {favorited ? <HiHeart color={COLORS.accent} /> : <HiOutlineHeart />}
      </IconButton>
    </HStack>
  );

  return (
    <Card.Root size="md" borderColor={favorited ? COLORS.accent : undefined}>
      <Card.Header>
        <Text fontSize="sm" fontWeight="semibold" textWrap="pretty" mb={-2}>
          {degreeName}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          {schoolBadge}
          <Separator />
          {footer}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
