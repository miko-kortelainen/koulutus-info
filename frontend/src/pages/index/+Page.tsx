import { Box, Heading, Image, Stack, Text, VStack } from "@chakra-ui/react";
import QuickLinkTabs from "@/components/quickLinks/QuickLinkTabs";
import useEducationLevel from "@/components/quickLinks/useEducationLevel";
import Yhteishaku2027Cta from "@/components/Yhteishaku2027Cta";
import { HEADER_HEIGHT } from "@/layout/Header";
import PageContainer from "@/layout/PageContainer";
import HeroButtons from "@/pages/index/components/HeroButtons";
import IosInstallTip from "@/pages/index/components/IosInstallTip";
import LandingHeadline from "@/pages/index/components/LandingHeadline";
import { COLORS } from "@/theme";

function landingOverlay(headerMix: number, midMix: number, midUntil: string): string {
  const wash = (mix: number, stop: string) => `color-mix(in srgb, ${COLORS.bg} ${mix}%, transparent) ${stop}`;

  return [
    `linear-gradient(to bottom, ${COLORS.bg}`,
    wash(headerMix, HEADER_HEIGHT),
    wash(midMix, `calc(${HEADER_HEIGHT} + 4.5rem)`),
    wash(midMix, midUntil),
    `${COLORS.bg})`,
  ].join(", ");
}

function LandingBackground() {
  return (
    <Box aria-hidden="true" inset={0} overflow="hidden" pointerEvents="none" position="absolute" zIndex={0}>
      <Image
        alt=""
        fetchPriority="high"
        height="100%"
        loading="eager"
        objectFit="cover"
        objectPosition="center"
        src="/images/nature.avif"
        width="100%"
      />
      <Box backgroundImage={landingOverlay(55, 8, "70%")} inset={0} position="absolute" />
    </Box>
  );
}

export default function LandingPage() {
  const [sectionId, setSectionId] = useEducationLevel();

  const hero = (
    <Box
      display="flex"
      flexDirection="column"
      minH="100dvh"
      mt={`calc(-1 * ${HEADER_HEIGHT})`}
      overflow="hidden"
      position="relative"
      pt={{
        base: `calc(${HEADER_HEIGHT} + 1rem)`,
        md: `calc(${HEADER_HEIGHT} + 6dvh)`,
        lg: `calc(${HEADER_HEIGHT} + 1.5rem)`,
      }}
    >
      <LandingBackground />
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent={{ base: "center", md: "flex-start", lg: "center" }}
        margin="0 auto"
        maxW="65rem"
        minH={0}
        pb={{ base: 10, md: 12, lg: 6 }}
        position="relative"
        px={{ base: 4, md: 6, lg: 0 }}
        transform={{ lg: "translateY(-1.75rem)" }}
        width="100%"
        zIndex={1}
      >
        <Stack align="center" gap={8} textAlign="center">
          <LandingHeadline />

          <HeroButtons />
        </Stack>
      </Box>
    </Box>
  );

  return (
    <>
      {hero}
      <Box as="section" bg="bg">
        <PageContainer>
          <VStack flex={1} gap={10} justifyContent="center" py={10}>
            <Stack alignItems="start" gap={2} width="100%">
              <Heading as="h2" fontSize={{ base: "3xl", md: "4xl" }}>
                Suunnittele hakusi.
              </Heading>
              <Text color="fg.muted" fontSize={{ base: "md", md: "lg" }}>
                Laske pisteesi, tutki koulutuksia ja vertaa vaihtoehtoja yhdessä paikassa.
              </Text>
            </Stack>
            <Yhteishaku2027Cta />
            <IosInstallTip />
            <QuickLinkTabs onValueChange={setSectionId} value={sectionId} />
          </VStack>
        </PageContainer>
      </Box>
    </>
  );
}
