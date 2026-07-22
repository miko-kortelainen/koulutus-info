import { Badge, Button, Card, HStack, Link, Separator, SimpleGrid, Stack, Stat, Text } from "@chakra-ui/react";
import { memo } from "react";
import { HiLocationMarker, HiPlus } from "react-icons/hi";
import { slugify } from "@/lib/slug";
import { formatCount, formatSisaanpaasyprosentti, getHakijapaine, getTier } from "@/lib/statistics";
import { COLORS } from "@/theme";
import type { StatisticsEntry } from "@/types.gen";

interface DegreeStatsCardProps {
  degree: StatisticsEntry;
  isSelected?: boolean;
  selectionFull?: boolean;
  onToggleCompare?: (degree: StatisticsEntry) => void;
}

function DegreeStatsCard({ degree, isSelected, selectionFull, onToggleCompare }: DegreeStatsCardProps) {
  const hakijapaine = getHakijapaine(degree);
  const tier = hakijapaine != null ? getTier(hakijapaine) : null;

  const stats = (
    <SimpleGrid columns={{ base: 2, md: 4 }}>
      <Stat.Root
        borderBottomWidth={{ base: "1px", md: "0" }}
        borderColor="border.subtle"
        gap={1}
        pb={{ base: 3, md: 0 }}
        pe={3}
        size={{ base: "sm", md: "md" }}
      >
        <Stat.Label color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
          Sisäänpääsyprosentti
        </Stat.Label>
        <Stat.ValueText color="fg.accent" fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {formatSisaanpaasyprosentti(degree.valitutLkm, degree.kaikkiHakijatLkm)}
        </Stat.ValueText>
      </Stat.Root>

      <Stat.Root
        borderBottomWidth={{ base: "1px", md: "0" }}
        borderColor="border.subtle"
        borderInlineStartWidth="1px"
        gap={1}
        pb={{ base: 3, md: 0 }}
        pe={{ base: 0, md: 3 }}
        ps={3}
        size={{ base: "sm", md: "md" }}
      >
        <Stat.Label color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
          Kaikki hakijat
        </Stat.Label>
        <Stat.ValueText fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {formatCount(degree.kaikkiHakijatLkm)}
        </Stat.ValueText>
      </Stat.Root>

      <Stat.Root
        borderColor="border.subtle"
        borderInlineStartWidth={{ base: "0", md: "1px" }}
        gap={1}
        pe={3}
        ps={{ base: 0, md: 3 }}
        pt={{ base: 3, md: 0 }}
        size={{ base: "sm", md: "md" }}
      >
        <Stat.Label color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
          Ensisijaiset hakijat
        </Stat.Label>
        <Stat.ValueText fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {formatCount(degree.ensisijaisetHakijatLkm)}
        </Stat.ValueText>
      </Stat.Root>

      <Stat.Root
        borderColor="border.subtle"
        borderInlineStartWidth="1px"
        gap={1}
        ps={3}
        pt={{ base: 3, md: 0 }}
        size={{ base: "sm", md: "md" }}
      >
        <Stat.Label color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
          Aloituspaikat
        </Stat.Label>
        <Stat.ValueText fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {formatCount(degree.aloituspaikatLkm)}
        </Stat.ValueText>
      </Stat.Root>
    </SimpleGrid>
  );

  const header = (
    <Stack gap={2}>
      <Link
        alignSelf="flex-start"
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="semibold"
        href={`/koulut/${slugify(degree.korkeakoulu ?? "")}/`}
        textDecor="none"
      >
        <Badge bg="accent" size="sm">
          <HiLocationMarker aria-hidden="true" color={COLORS.text} /> {degree.korkeakoulu}
        </Badge>
      </Link>
      <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" textWrap="pretty">
        {degree.hakukohde}
      </Text>
    </Stack>
  );

  const footer = (
    <HStack flexWrap="wrap" gap={2} justify="space-between">
      <Badge
        bg={tier ? `color-mix(in srgb, ${tier.bg} 14%, ${COLORS.bg})` : undefined}
        color={tier?.bg}
        fontWeight="semibold"
        height={6}
        rounded="sm"
        size={{ base: "sm", md: "md" }}
        variant="subtle"
      >
        {tier ? `${tier.label} hakijapaine` : "Määrittämätön hakijapaine"}
      </Badge>
      {onToggleCompare ? (
        <Button
          bg={isSelected ? COLORS.accent : undefined}
          borderColor="accent"
          color={isSelected ? COLORS.bg : "fg.accent"}
          disabled={!isSelected && selectionFull}
          height={6}
          onClick={() => onToggleCompare(degree)}
          rounded="sm"
          size={{ base: "2xs", md: "sm" }}
          variant={isSelected ? "solid" : "outline"}
        >
          {!isSelected ? <HiPlus aria-hidden="true" /> : null} {isSelected ? "Valittu ✓" : "Vertaile"}
        </Button>
      ) : null}
    </HStack>
  );

  return (
    <Card.Root as="li" borderColor="border.subtle" size="md" zIndex={1}>
      <Card.Header pb={4}>{header}</Card.Header>
      <Card.Body pt={0}>
        <Stack>
          <Separator />
          {stats}
          <Separator />
          {footer}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export default memo(DegreeStatsCard);
