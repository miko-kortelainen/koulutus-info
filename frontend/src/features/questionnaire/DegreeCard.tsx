import { Button, Card, Heading, Stack } from "@chakra-ui/react";
import { HiChevronRight, HiExternalLink } from "react-icons/hi";
import { type VipunenData } from "../../types.gen";

type Props = {
  tutkintonimike: string;
  score?: number;
  degreeData: VipunenData[];
  onShowMore: (degreeData: VipunenData[]) => void;
};

export default function DegreeCard({ tutkintonimike, degreeData, onShowMore }: Props) {
  return (
    <Card.Root>
      <Card.Header>
        <Stack direction="row">
          <Heading mr="auto">{tutkintonimike}</Heading>
        </Stack>
      </Card.Header>
      <Card.Body>
        <Stack direction="row">
          <Button size="xs" variant="outline" asChild>
            <a
              target="_blank"
              href={`https://opintopolku.fi/konfo/fi/haku/${tutkintonimike}?koulutustyyppi=amk-alempi`}
            >
              Etsi opintopolusta
              <HiExternalLink />
            </a>
          </Button>
          <Button colorPalette="green" size="xs" variant="outline" onClick={() => onShowMore(degreeData)} ml="auto">
            Näytä koulutukset <HiChevronRight />
          </Button>
        </Stack>
      </Card.Body>
    </Card.Root>
  );
}
