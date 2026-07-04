import { memo } from "react";
import { Card, Stack, Badge, Text, Stat, HStack, Separator, Button } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type StatisticsEntry } from "../../../types.gen";
import { COLORS } from "../../../theme";
import { Tooltip } from "../../../components/ui/tooltip";
import { formatCount, getTier } from "../../../components/hakijapaineTier";

type Props = {
  degree: StatisticsEntry;
  isSelected: boolean;
  selectionFull: boolean;
  onToggleCompare: (degree: StatisticsEntry) => void;
};

function DegreeStatCard({ degree, isSelected, selectionFull, onToggleCompare }: Props) {
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
              letterSpacing="wide"
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
              <Stat.ValueText>{formatCount(degree.aloituspaikatLkm)}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 4, md: 1 }}>
              <Stat.Label fontSize={{ base: "xs", md: "md" }} p={0}>
                Ensisijaiset hakijat
              </Stat.Label>
              <Stat.ValueText>{formatCount(degree.ensisijaisetHakijatLkm)}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root size={{ base: "sm", md: "md" }} flex={{ base: 4, md: 1 }}>
              <Stat.Label fontSize={{ base: "xs", md: "md" }}>Kaikki hakijat</Stat.Label>
              <Stat.ValueText>{formatCount(degree.kaikkiHakijatLkm)}</Stat.ValueText>
            </Stat.Root>
          </HStack>

          <HStack justify="space-between" alignItems="center">
            {tier ? (
              <HStack alignItems="center" gap={1}>
                <Tooltip showArrow content={`${hakijapaine!.toFixed(2)} hakijaa / paikka`}>
                  <Badge size={{ base: "sm", md: "lg" }} bg={tier.bg} color={tier.color} fontWeight="semibold">
                    {tier.label}
                  </Badge>
                </Tooltip>
                <Text color="fg.muted" fontSize={{ base: "xs", md: "sm" }}>
                  hakijapaine
                </Text>
              </HStack>
            ) : null}
            <Button
              size={{ base: "2xs", md: "sm" }}
              variant={isSelected ? "solid" : "surface"}
              bg={COLORS.accent}
              disabled={!isSelected && selectionFull}
              onClick={() => onToggleCompare(degree)}
            >
              {isSelected ? "Valittu ✓" : "Vertaile"}
            </Button>
          </HStack>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}

export default memo(DegreeStatCard);
