import { Card, Stack, Badge, Group, Text, Stat } from "@chakra-ui/react";
import { HiLocationMarker } from "react-icons/hi";
import { type StatisticsEntry } from "../../../types.gen";
import { COLORS } from "../../../theme";

type Props = {
  degree: StatisticsEntry;
};

export default function DegreeStatCard({ degree }: Props) {
  return (
    <Card.Root size="md" zIndex={1}>
      <Card.Header textWrap="balanced">
        <Text fontSize="lg" fontWeight={"semibold"}>
          {degree.hakukohde}
        </Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          <Badge colorPalette={COLORS.accent} mr="auto" size={"md"}>
            <HiLocationMarker /> {degree.korkeakoulu}
          </Badge>

          <Group>
            <Stat.Root>
              <Stat.Label>Hakijat</Stat.Label>
              <Stat.ValueText>{(degree.kaikkiHakijatLkm ?? 0) < 5 ? "1-5" : degree.kaikkiHakijatLkm}</Stat.ValueText>
            </Stat.Root>

            <Stat.Root>
              <Stat.Label>Aloituspaikat</Stat.Label>
              <Stat.ValueText>{(degree.aloituspaikatLkm ?? 0) < 5 ? "alle 5" : degree.aloituspaikatLkm}</Stat.ValueText>
            </Stat.Root>
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
