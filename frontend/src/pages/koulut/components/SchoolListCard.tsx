import { Badge, Card, HStack, Separator, SimpleGrid, Stack, Stat, Text } from "@chakra-ui/react";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { formatCount, formatSisaanpaasyprosentti, getHakijapaine, getTier, ratioFormat } from "@/lib/statistics";
import { COLORS } from "@/theme";
import type { SchoolListItem } from "../+data";

interface SchoolListCardProps {
  school: SchoolListItem;
}

export default function SchoolListCard({ school }: SchoolListCardProps) {
  const hakijapaine = getHakijapaine({
    aloituspaikatLkm: school.aloituspaikat,
    ensisijaisetHakijatLkm: school.ensisijaisetHakijat,
  });

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
          {formatSisaanpaasyprosentti(school.valitut, school.kaikkiHakijat)}
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
          Hakijat
        </Stat.Label>
        <Stat.ValueText fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {formatCount(school.kaikkiHakijat)}
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
          {formatCount(school.ensisijaisetHakijat)}
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
          Opiskelijapalaute (ka.)
        </Stat.Label>
        <Stat.ValueText fontSize={{ base: "md", md: "lg" }} fontWeight="semibold">
          {school.feedbackAverage == null || school.feedbackMaxScore == null
            ? "–"
            : `${ratioFormat.format(school.feedbackAverage)} / ${school.feedbackMaxScore}`}
        </Stat.ValueText>
      </Stat.Root>
    </SimpleGrid>
  );

  const footer = (
    <HStack flexWrap="wrap" gap={4} justify="space-between">
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
      {school.koulutuksia > 0 ? (
        <Badge bg={COLORS.accent} color={COLORS.text} fontWeight="semibold" height={6} rounded="sm" size="sm">
          Mukana syksyn yhteishaussa!
        </Badge>
      ) : null}
    </HStack>
  );

  return (
    <Card.Root asChild borderColor="border.subtle" size="md" zIndex={1}>
      <a href={`/koulut/${school.slug}/`}>
        <Card.Header pb={4}>
          <HStack gap={2}>
            <HiOutlineAcademicCap aria-hidden="true" color={COLORS.accentFg} />
            <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" textWrap="pretty">
              {school.name}
            </Text>
          </HStack>
        </Card.Header>
        <Card.Body pt={0}>
          <Stack>
            <Separator />
            {stats}
            <Separator />
            {footer}
          </Stack>
        </Card.Body>
      </a>
    </Card.Root>
  );
}
