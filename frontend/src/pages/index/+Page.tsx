import { Button, Center, Heading, Highlight, Stack, Text } from "@chakra-ui/react";
import { HiArrowRight } from "react-icons/hi";
import { navigate } from "vike/client/router";

export default function LandingPage() {
  function navigateToStats() {
    navigate("/hakijamaarat");
  }

  return (
    <>
      <Center flex={1}>
        <Stack gap={10} px="10" textAlign="center" alignItems="center" textWrap="pretty">
          <Stack gap={10}>
            <Heading size={{ base: "3xl", md: "5xl" }} fontWeight="bold">
              <Highlight query="yhteishaku" styles={{ color: "green.400" }}>
                yhteishaku.app
              </Highlight>
            </Heading>
            <Text fontSize={{ base: "md" }} fontWeight="semibold">
              Tutki korkeakoulujen yhteishaun hakijamääriä, trendejä sekä koulutustarjontaa.
            </Text>
          </Stack>

          <Button size={{ base: "xs", md: "lg" }} colorPalette="green" onClick={navigateToStats}>
            Aloitetaan! <HiArrowRight />
          </Button>
        </Stack>
      </Center>
    </>
  );
}
