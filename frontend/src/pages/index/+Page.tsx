import { Badge, Button, Center, Group, Heading, Stack, Text, VStack } from "@chakra-ui/react";
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
              yhteishaku.app
            </Heading>
            <VStack>
              <Text fontSize={{ base: "md", md: "xl" }} fontWeight="semibold" textWrap="pretty">
                Selaa korkeakoulujen yhteishaun
              </Text>
              <Group>
                <Badge size={{ base: "md", md: "lg" }} bg={COLORS.accent} color={COLORS.text}>
                  Hakijamääriä
                </Badge>

                <Badge size={{ base: "md", md: "lg" }} bg={COLORS.accent} color={COLORS.text}>
                  Trendejä
                </Badge>

                <Badge size={{ base: "md", md: "lg" }} bg={COLORS.accent} color={COLORS.text}>
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
