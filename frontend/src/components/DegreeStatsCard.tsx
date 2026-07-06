import { memo } from "react";
import { Card, Stack, Badge, Text, Stat, HStack, Separator, Button } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type StatisticsEntry } from "@/types.gen";
import { COLORS } from "@/theme";
import { formatCount, getHakijapaine, getTier } from "@/components/hakijapaineTier";
import { slugifySchoolName } from "@/components/slug";

interface DegreeStatsCardProps {
  degree: StatisticsEntry;
  isSelected?: boolean;
  selectionFull?: boolean;
  onToggleCompare?: (degree: StatisticsEntry) => void;
}

function DegreeStatCard({ degree, isSelected, selectionFull, onToggleCompare }: DegreeStatsCardProps) {
  const hakijapaine = getHakijapaine(degree);
  const tier = hakijapaine != null ? getTier(hakijapaine) : null;

  const schoolBadge = (
    <HStack alignItems="center">
      <Badge
        asChild
        bg={COLORS.accent}
        color={COLORS.text}
        fontWeight="semibold"
        letterSpacing="wide"
        mr="auto"
        size={{ base: "sm", md: "lg" }}
      >
        <a href={`/koulut/${slugifySchoolName(degree.korkeakoulu ?? "")}/`}>
          <HiLocationMarker /> {degree.korkeakoulu}
        </a>
      </Badge>
    </HStack>
  );

  const stats = (
    <HStack alignItems="flex-start" gap={2}>
      <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 3, md: 1 }}>
        <Stat.Label fontSize={{ base: "xs", md: "md" }} mb={-2}>
          Aloituspaikat
        </Stat.Label>
        <Stat.ValueText fontSize="md">{formatCount(degree.aloituspaikatLkm)}</Stat.ValueText>
      </Stat.Root>

      <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 4, md: 1 }}>
        <Stat.Label fontSize={{ base: "xs", md: "md" }} mb={-2}>
          Ensisijaiset hakijat
        </Stat.Label>
        <Stat.ValueText fontSize="md">{formatCount(degree.ensisijaisetHakijatLkm)}</Stat.ValueText>
      </Stat.Root>

      <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 4, md: 1 }}>
        <Stat.Label fontSize={{ base: "xs", md: "md" }} mb={-2}>
          Kaikki hakijat
        </Stat.Label>
        <Stat.ValueText fontSize="md">{formatCount(degree.kaikkiHakijatLkm)}</Stat.ValueText>
      </Stat.Root>
    </HStack>
  );

  const header = (
    <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" textWrap="pretty" mb={-2}>
      {degree.hakukohde}
    </Text>
  );

  const footer = (
    <HStack justify="space-between" alignItems="center">
      {tier ? (
        <HStack alignItems="center" gap={1}>
          <Badge size={{ base: "sm", md: "lg" }} bg={tier.bg} color={tier.color} fontWeight="semibold">
            {tier.label}
          </Badge>

          <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
            hakijapaine
          </Text>
        </HStack>
      ) : null}
      {onToggleCompare ? (
        <Button
          size={{ base: "2xs", md: "sm" }}
          variant={isSelected ? "solid" : "surface"}
          bg={COLORS.accent}
          disabled={!isSelected && selectionFull}
          onClick={() => onToggleCompare(degree)}
        >
          {isSelected ? "Valittu ✓" : "Vertaile"}
        </Button>
      ) : null}
    </HStack>
  );

  return (
    <Card.Root size="md" zIndex={1}>
      <Card.Header>{header}</Card.Header>
      <Card.Body>
        <Stack>
          {schoolBadge}
          <Separator />
          {stats}
          {footer}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export default memo(DegreeStatCard);
