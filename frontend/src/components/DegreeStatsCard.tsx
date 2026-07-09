import { Badge, Button, Card, HStack, Separator, Stack, Stat, Text } from "@chakra-ui/react";
import { memo } from "react";
import { HiLocationMarker } from "react-icons/hi";
import { formatCount, getHakijapaine, getTier } from "@/components/hakijapaineTier";
import { slugifySchoolName } from "@/components/slug";
import { COLORS } from "@/theme";
import type { StatisticsEntry } from "@/types.gen";

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
      <Stat.Root flex={{ base: 3, md: 1 }} size={{ base: "sm", md: "md" }}>
        <Stat.Label fontSize={{ base: "xs", md: "md" }} mb={-2}>
          Aloituspaikat
        </Stat.Label>
        <Stat.ValueText fontSize="md">{formatCount(degree.aloituspaikatLkm)}</Stat.ValueText>
      </Stat.Root>

      <Stat.Root flex={{ base: 4, md: 1 }} size={{ base: "sm", md: "md" }}>
        <Stat.Label fontSize={{ base: "xs", md: "md" }} mb={-2}>
          Ensisijaiset hakijat
        </Stat.Label>
        <Stat.ValueText fontSize="md">{formatCount(degree.ensisijaisetHakijatLkm)}</Stat.ValueText>
      </Stat.Root>

      <Stat.Root flex={{ base: 4, md: 1 }} size={{ base: "sm", md: "md" }}>
        <Stat.Label fontSize={{ base: "xs", md: "md" }} mb={-2}>
          Kaikki hakijat
        </Stat.Label>
        <Stat.ValueText fontSize="md">{formatCount(degree.kaikkiHakijatLkm)}</Stat.ValueText>
      </Stat.Root>
    </HStack>
  );

  const header = (
    <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" mb={-2} textWrap="pretty">
      {degree.hakukohde}
    </Text>
  );

  const footer = (
    <HStack alignItems="center" justify="space-between">
      <HStack alignItems="center" gap={1}>
        {tier ? (
          <Badge bg={tier.bg} color={tier.color} fontWeight="semibold" size={{ base: "sm", md: "lg" }}>
            {tier.label}
          </Badge>
        ) : (
          <Badge colorPalette="gray" fontWeight="semibold" size={{ base: "sm", md: "lg" }} variant="surface">
            Määrittämätön
          </Badge>
        )}

        <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
          hakijapaine
        </Text>
      </HStack>
      {onToggleCompare ? (
        <Button
          bg={COLORS.accent}
          disabled={!isSelected && selectionFull}
          onClick={() => onToggleCompare(degree)}
          size={{ base: "2xs", md: "sm" }}
          variant={isSelected ? "solid" : "surface"}
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
