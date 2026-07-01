import { Card, Stack, Badge, Text, Stat, HStack, Separator } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type StatisticsEntry } from "../../../types.gen";
import { COLORS } from "../../../theme";
import { Tooltip } from "../../../components/ui/tooltip";

// ponytail: tune cutoffs if tier distribution looks off in real data
const TIERS = [
  { maxExclusive: 3, label: "Matala", bg: "oklch(0.376 0.077 159.44)", color: "oklch(1 0 0)" },
  { maxExclusive: 10, label: "Keskiverto", bg: "oklch(0.476 0.128 39.44)", color: "oklch(1 0 0)" },
  { maxExclusive: Infinity, label: "Korkea", bg: "oklch(0.376 0.113 13.636)", color: "oklch(1 0 0)" },
] as const;

const getTier = (ratio: number) => TIERS.find((t) => ratio < t.maxExclusive)!;

type Props = {
  degree: StatisticsEntry;
};

export default function DegreeStatCard({ degree }: Props) {
  const hakijapaine = degree.aloituspaikatLkm ? degree.ensisijaisetHakijatLkm / degree.aloituspaikatLkm : null;
  const tier = hakijapaine != null ? getTier(hakijapaine) : null;

  return (
    <Card.Root size="md" zIndex={1}>
      <Card.Header>
        <Text fontSize={{ base: "sm", md: "lg" }} fontWeight="semibold" textWrap="pretty">
          {degree.hakukohde}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          <HStack alignItems="center">
            <Badge
              bg={COLORS.accent}
              color={COLORS.text}
              fontWeight="semibold"
              letterSpacing={"wide"}
              mr="auto"
              size={{ base: "sm", md: "lg" }}
            >
              <HiLocationMarker /> {degree.korkeakoulu}
            </Badge>
          </HStack>

          <Separator />

          <HStack alignItems="flex-start" gap={2}>
            <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 3, md: 1 }}>
              <Stat.Label fontSize={{ base: "xs", md: "md" }}>Aloituspaikat</Stat.Label>
              <Stat.ValueText>{(degree.aloituspaikatLkm ?? 0) < 5 ? "alle 5" : degree.aloituspaikatLkm}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 4, md: 1 }}>
              <Stat.Label fontSize={{ base: "xs", md: "md" }} p={0}>
                Ensisijaiset hakijat
              </Stat.Label>
              <Stat.ValueText>
                {(degree.ensisijaisetHakijatLkm ?? 0) < 5 ? "alle 5" : degree.ensisijaisetHakijatLkm}
              </Stat.ValueText>
            </Stat.Root>

            <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 4, md: 1 }}>
              <Stat.Label fontSize={{ base: "xs", md: "md" }}>Kaikki hakijat</Stat.Label>
              <Stat.ValueText>{(degree.kaikkiHakijatLkm ?? 0) < 5 ? "alle 5" : degree.kaikkiHakijatLkm}</Stat.ValueText>
            </Stat.Root>
          </HStack>

          {tier ? (
            <HStack alignItems="center" ml="auto">
              <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
                Hakijapaine:
              </Text>
              <Tooltip showArrow content={`${hakijapaine!.toFixed(2)} hakijaa / paikka`}>
                <Badge size={{ base: "sm", md: "lg" }} bg={tier.bg} color={tier.color} fontWeight="semibold">
                  {tier.label}
                </Badge>
              </Tooltip>
            </HStack>
          ) : null}
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
