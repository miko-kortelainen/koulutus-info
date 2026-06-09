import { Button, Center, Heading, Highlight, Stack } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  function navigateToDegrees() {
    navigate("/koulutukset");
  }

  return (
    <Center h="100%">
      <Stack gap={10}>
        <Stack textAlign="center">
          <Heading size="6xl" data-cy="landing-page-header">
            <Highlight query="korkeakoulutuksia" styles={{ color: "blue.400" }}>
              Etsi korkeakoulutuksia
            </Highlight>
          </Heading>
          <Heading>Tutkaile yhteishaun hakijamääriä.</Heading>
        </Stack>

        <Button variant="surface" onClick={navigateToDegrees} data-cy="landing-page-start-button">
          Aloitetaan! <HiArrowRight />
        </Button>
      </Stack>
    </Center>
  );
}
