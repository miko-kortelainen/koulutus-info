import { Button, Center, Heading, Highlight, Stack } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  function navigateToStats() {
    navigate("/hakijamaarat");
  }

  return (
    <Center h="100%" border="1px solid red">
      <Stack gap={10} px="10">
        <Stack textAlign="center">
          <Heading size={{ base: "3xl", md: "5xl" }}>
            <Highlight query="korkeakoulutuksia" styles={{ color: "blue.400" }}>
              Etsi korkeakoulutuksia
            </Highlight>
          </Heading>
          <Heading size={{ base: "sm" }}>
            Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa.
          </Heading>
        </Stack>

        <Button size={{ base: "sm", md: "lg" }} variant="surface" onClick={navigateToStats}>
          Aloitetaan! <HiArrowRight />
        </Button>
      </Stack>
    </Center>
  );
}
