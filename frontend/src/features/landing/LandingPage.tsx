import { Button, Center, Heading, Highlight, Stack } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi";
import { navigate } from "vike/client/router";

export default function LandingPage() {
  function navigateToStats() {
    navigate("/hakijamaarat");
  }

  return (
    <>
      <title>yhteishaku.app - Korkeakoulujen hakijamäärät ja koulutustarjonta</title>
      <meta
        name="description"
        content="Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa."
      />
      <Center h="100%">
        <Stack gap={10} px="10">
          <Stack textAlign="center" gap={10}>
            <Heading size={{ base: "3xl", md: "5xl" }}>
              <Highlight query="yhteishaku" styles={{ color: "green.400" }}>
                yhteishaku.app
              </Highlight>
            </Heading>
            <Heading size={{ base: "sm" }}>
              Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa.
            </Heading>
          </Stack>

          <Button size={{ base: "xs", md: "lg" }} variant="surface" onClick={navigateToStats}>
            Aloitetaan! <HiArrowRight />
          </Button>
        </Stack>
      </Center>
    </>
  );
}
