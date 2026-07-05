import { Badge, Card, Group, HStack, Text, VStack } from "@chakra-ui/react";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { COLORS } from "@/theme";
import { formatCount, getHakijapaine, getTier } from "@/components/hakijapaineTier";
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

  const availabilityBadge =
    school.koulutuksia > 0 ? (
      <Badge
        bg={COLORS.accent}
        color={COLORS.text}
        size={{ base: "xs", md: "md" }}
        fontWeight="semibold"
        width="fit-content"
      >
        Mukana syksyn yhteishaussa!
      </Badge>
    ) : null;

  const nameRow = (
    <HStack gap={2} flex={1} width="100%">
      <Group flex={1}>
        <HiOutlineAcademicCap color={COLORS.accent} />
        <Text fontWeight="semibold" fontSize={{ base: "xs", md: "md" }} letterSpacing="wide">
          {school.name}
        </Text>
      </Group>
      {availabilityBadge}
    </HStack>
  );

  const hakijaStats = (
    <Text color="fg.muted" fontSize={{ base: "xs", md: "md" }} mt={1}>
      {formatCount(school.kaikkiHakijat)} hakijaa · {formatCount(school.ensisijaisetHakijat)} ensisijaista hakijaa
    </Text>
  );

  const tierBadge = tier ? (
    <HStack alignItems="center" gap={1} mt={1}>
      <Badge size={{ base: "xs", md: "md" }} bg={tier.bg} color={tier.color} fontWeight="semibold">
        {tier.label}
      </Badge>
      <Text color="fg.muted" fontSize={{ base: "xs", md: "md" }}>
        hakijapaine
      </Text>
    </HStack>
  ) : null;

  return (
    <Card.Root size="sm" asChild>
      <a href={`/koulut/${school.slug}`}>
        <Card.Body>
          <VStack alignItems="flex-start">
            {nameRow}
            {hakijaStats}
            {tierBadge}
          </VStack>
        </Card.Body>
      </a>
    </Card.Root>
  );
}
