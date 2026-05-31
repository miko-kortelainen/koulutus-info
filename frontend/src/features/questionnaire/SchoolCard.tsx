import { Card, Stack, Badge, Group } from "@chakra-ui/react";
import { HiLocationMarker, HiChartBar } from "react-icons/hi";
import { type VipunenData } from "../../types.gen";

type Props = {
  degree: VipunenData;
};

export default function SchoolCard({ degree }: Props) {
  return (
    <Card.Root>
      <Card.Header textWrap="pretty">{degree.hakukohde}</Card.Header>
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
