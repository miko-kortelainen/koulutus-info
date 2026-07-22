import { Badge, Card, HStack, IconButton, Link, Separator, Stack, Text, VStack } from "@chakra-ui/react";
import { HiChevronDown, HiChevronUp, HiHeart, HiLocationMarker, HiOutlineHeart } from "react-icons/hi";
import useFavorites from "@/hooks/useFavorites";
import { alaSlugParam } from "@/lib/cutoffs";
import { slugify } from "@/lib/slug";
import { COLORS } from "@/theme";
import type { ToteutusEntry } from "@/types.gen";

interface SchoolCardProps {
  toteutus: ToteutusEntry;
  index?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export default function SchoolCard({ toteutus, index, onMoveUp, onMoveDown }: SchoolCardProps) {
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
      mb={2}
      size={{ base: "sm", md: "lg" }}
      width="fit"
    >
      <a href={`/koulut/${slugify(schoolName)}/`}>
        <HiLocationMarker /> {schoolName}
      </a>
    </Badge>
  );

  // koulutusalat is absent on favorites saved before the field existed
  const pisterajatURL = toteutus.koulutusalat?.length
    ? `/koulut/${slugify(schoolName)}/pisterajat/?ala=${alaSlugParam(toteutus.koulutusalat)}`
    : null;

  const footer = (
    <HStack alignItems="center" justify="space-between">
      <VStack align="flex-start" gap={6}>
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
            Hae opintopolussa
          </Link>
        ) : null}
        {pisterajatURL ? (
          <Link
            fontSize="sm"
            href={pisterajatURL}
            letterSpacing="wide"
            textDecoration="underline"
            textDecorationColor={COLORS.accentFg}
            textDecorationStyle="dotted"
          >
            Katso alan pisterajat
          </Link>
        ) : null}
      </VStack>
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
    <Card.Root
      as="li"
      borderColor={favorited ? COLORS.accentFg : undefined}
      size="md"
      style={index !== undefined ? { viewTransitionName: `oma-hakulista-${toteutus.toteutusOid}` } : undefined}
    >
      <Card.Header>
        <HStack justify="space-between">
          <Text fontSize="sm" fontWeight="semibold" mb={-2} textWrap="pretty">
            {index !== undefined ? `${index}. ` : null}
            {degreeName}
          </Text>
          {index !== undefined ? (
            <VStack gap={6} mr={1}>
              <IconButton
                aria-label="Siirrä ylöspäin"
                disabled={!onMoveUp}
                height="fit"
                onClick={onMoveUp}
                size="md"
                variant="ghost"
              >
                <HiChevronUp />
              </IconButton>
              <IconButton
                aria-label="Siirrä alaspäin"
                disabled={!onMoveDown}
                height="fit"
                onClick={onMoveDown}
                size="md"
                variant="ghost"
              >
                <HiChevronDown />
              </IconButton>
            </VStack>
          ) : null}
        </HStack>
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
