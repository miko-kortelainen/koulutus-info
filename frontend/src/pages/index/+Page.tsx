import { Badge, Button, Center, Group, Heading, Highlight, Stack, Text, VStack } from "@chakra-ui/react";
import { HiCursorClick } from "react-icons/hi";
import { navigate } from "vike/client/router";
import { COLORS } from "../../theme";

export default function LandingPage() {
  function navigateToStats() {
    navigate("/hakijamaarat");
  }

  return (
    <>
      <Center flex={1}>
        <Stack gap={{ base: "10", md: "20" }} px="10" textAlign="center" alignItems="center">
          <Stack gap={{ base: "6", md: "12" }}>
            <Heading size={{ base: "3xl", md: "5xl" }} fontWeight="bold" letterSpacing="widest">
              <Highlight query="yhteishaku" styles={{ color: `${COLORS.accent}.400` }}>
                yhteishaku.app
              </Highlight>
            </Heading>
            <VStack>
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="semibold" textWrap="pretty">
                Selaa korkeakoulujen yhteishaun
              </Text>
              <Group>
                <Badge size={{ base: "md", md: "lg" }} colorPalette={COLORS.accent}>
                  Hakijamääriä
                </Badge>

                <Badge size={{ base: "md", md: "lg" }} colorPalette={COLORS.accent}>
                  Trendejä
                </Badge>

                <Badge size={{ base: "md", md: "lg" }} colorPalette={COLORS.accent}>
                  Koulutuksia
                </Badge>
              </Group>
            </VStack>
          </Stack>

          <Button
            size={{ base: "xs", md: "lg" }}
            onClick={navigateToStats}
            width={{ base: "100%" }}
            letterSpacing="wide"
            bgColor="oklch(0.389 0.097 145)"
            color="white"
          >
            Aloitetaan! <HiCursorClick />
          </Button>
        </Stack>
      </Center>
    </>
  );
}
