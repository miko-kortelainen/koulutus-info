import { Badge, Card, HStack, IconButton, Link, Separator, Stack, Text } from "@chakra-ui/react";
import { HiHeart, HiLocationMarker, HiOutlineHeart } from "react-icons/hi";
import { slugifySchoolName } from "@/components/slug";
import useFavorites from "@/hooks/useFavorites";
import { COLORS } from "@/theme";
import type { ToteutusEntry } from "@/types.gen";

interface SchoolCardProps {
  toteutus: ToteutusEntry;
}

export default function SchoolCard({ toteutus }: SchoolCardProps) {
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
    <HStack alignItems="center" justify="space-between">
      {toteutus.toteutusOid ? (
        <Link
          fontSize="sm"
          href={toteutusURL}
          letterSpacing="wide"
          rel="noopener noreferrer"
          target="_blank"
          textDecoration="underline"
          textDecorationColor={COLORS.accentFg}
          textDecorationStyle="dotted"
        >
          Katso opintopolussa
        </Link>
      ) : null}
      <IconButton
        aria-label={favorited ? "Poista tallennetuista" : "Tallenna"}
        height="fit"
        onClick={() => toggleFavorite(toteutus)}
        size="xl"
        variant="ghost"
      >
        {favorited ? <HiHeart color={COLORS.accentFg} /> : <HiOutlineHeart />}
      </IconButton>
    </HStack>
  );

  return (
    <Card.Root as="li" borderColor={favorited ? COLORS.accentFg : undefined} size="md">
      <Card.Header>
        <Text fontSize="sm" fontWeight="semibold" mb={-2} textWrap="pretty">
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
