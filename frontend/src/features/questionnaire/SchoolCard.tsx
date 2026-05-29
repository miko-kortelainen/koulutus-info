import { Card, Stack, Badge, Group } from "@chakra-ui/react";
import { HiLocationMarker, HiChartBar, HiExternalLink } from "react-icons/hi";
import type { DegreeData } from "./types/degree";

type Props = {
  degree: DegreeData;
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

            {degree.opintopolku_toteutus_oid ? (
              <Badge colorPalette="green" asChild ml="auto">
                <a href={`https://opintopolku.fi/konfo/fi/toteutus/${degree.opintopolku_toteutus_oid}`} target="_blank">
                  Katso opintopolussa <HiExternalLink />
                </a>
                )
              </Badge>
            ) : null}
          </Group>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
