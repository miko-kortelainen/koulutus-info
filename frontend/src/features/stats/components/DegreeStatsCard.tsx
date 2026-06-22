import { Card, Stack, Badge, Group, Text } from "@chakra-ui/react";
import { HiLocationMarker, HiChartBar } from "react-icons/hi";
import { type StatisticsEntry } from "../../../types.gen";

type Props = {
  degree: StatisticsEntry;
};

export default function DegreeStatCard({ degree }: Props) {
  return (
    <Card.Root size="sm" zIndex={-1}>
      <Card.Header textWrap="pretty">
        <Text fontSize="sm">{degree.hakukohde}</Text>
      </Card.Header>
      <Card.Body>
        <Stack>
          <Badge colorPalette="green" mr="auto">
            <HiLocationMarker /> {degree.korkeakoulu}
          </Badge>

          <Group>
            <Badge colorPalette="blue">
              <HiChartBar />
              {(degree.kaikkiHakijatLkm ?? 0) < 5 ? "~1-5 hakijaa" : `${degree.kaikkiHakijatLkm} hakijaa`}
            </Badge>

            <Badge colorPalette="blue">
              <HiChartBar />
              {degree.aloituspaikatLkm} aloituspaikkaa
            </Badge>
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
