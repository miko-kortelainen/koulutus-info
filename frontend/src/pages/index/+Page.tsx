import { Badge, Button, Center, Heading, HStack, Image, Stack, Text, VStack } from "@chakra-ui/react";
import { HiCursorClick } from "react-icons/hi";
import { navigate } from "vike/client/router";
import { COLORS } from "../../theme";

export default function LandingPage() {
  function navigateToStats() {
    navigate("/hakijamaarat/");
  }

  return (
    <>
      <Center flex={1}>
        <Stack gap={{ base: "14", md: "20" }} px="10" textAlign="center" alignItems="center">
          <Stack gap={{ base: "4", md: "7" }}>
            <VStack>
              <Image src="/images/logo.png" alt="yhteishaku.app" boxSize={{ base: "16", md: "28" }} />
              <Heading as="h1" size={{ base: "3xl", md: "5xl" }} fontWeight="bold" letterSpacing="widest">
                yhteishaku.app
              </Heading>
            </VStack>
            <VStack>
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="semibold" textWrap="pretty">
                Selaa ja vertaile korkeakoulujen yhteishaun
              </Text>
              <HStack justifyContent="center" gap={4} width="100%">
                <Badge letterSpacing="wide" size={{ base: "md", md: "lg" }} bg={COLORS.accent} color={COLORS.text}>
                  Hakijamääriä
                </Badge>

                <Badge letterSpacing="wide" size={{ base: "md", md: "lg" }} bg={COLORS.accent} color={COLORS.text}>
                  Trendejä
                </Badge>

                <Badge letterSpacing="wide" size={{ base: "md", md: "lg" }} bg={COLORS.accent} color={COLORS.text}>
                  Koulutuksia
                </Badge>
              </HStack>
            </VStack>
          </Stack>

          <Button
            size={{ base: "xs", md: "lg" }}
            onClick={navigateToStats}
            width={{ base: "80%" }}
            letterSpacing="wide"
            bgColor={COLORS.accent}
            color={COLORS.text}
          >
            Aloitetaan! <HiCursorClick />
          </Button>
        </Stack>
      </Center>
    </>
  );
}
