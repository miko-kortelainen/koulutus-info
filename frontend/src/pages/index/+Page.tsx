import { Box, Button, Heading, HStack, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { HiOutlineArrowRight, HiOutlineCalculator, HiOutlineChartBar } from "react-icons/hi";

import { HEADER_HEIGHT } from "@/layout/Header";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import IosInstallTip from "@/pages/index/components/IosInstallTip";
import QuickLinkCard from "@/pages/index/components/QuickLinkCard";
import { quickLinks } from "@/pages/index/components/quickLinks";
import useCountdown from "@/pages/index/hooks/useCountdown";

const heroLinks = [
  { href: "/pistelaskuri/", icon: HiOutlineCalculator, label: "Laske todistuspisteeni" },
  { href: "/hakijamaarat/", icon: HiOutlineChartBar, label: "Näytä hakijamäärät" },
];

function HeroButtons() {
  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 3, md: 4, lg: 8 }}
      position="relative"
      pt={{ base: 4, lg: 0 }}
      width={{ base: "100%", lg: "auto" }}
      zIndex={1}
    >
      {heroLinks.map(({ href, icon: Icon, label }) => (
        <Button
          _active={{ transform: "scale(0.96)" }}
          _hover={{ bg: "accentFg", color: "bg" }}
          asChild
          bg="accent"
          color="onAccent"
          key={href}
          transitionDuration="0.15s"
          transitionProperty="transform, background-color, color"
          transitionTimingFunction="ease-out"
          variant="solid"
          width={{ base: "100%", lg: "236px" }}
        >
          <a href={href}>
            <HStack gap={2} width="13rem">
              <Icon aria-hidden="true" />
              <Text as="span" flex={1} textAlign="left">
                {label}
              </Text>
              <HiOutlineArrowRight aria-hidden="true" />
            </HStack>
          </a>
        </Button>
      ))}
    </Stack>
  );
}

interface LandingIllustrationProps {
  fetchPriority?: "high";
  src: string;
  hideIn: "_light" | "_dark";
}

function LandingIllustration({ fetchPriority, hideIn, src }: LandingIllustrationProps) {
  return (
    <Image
      {...{ [hideIn]: { display: "none" } }}
      alt=""
      aria-hidden="true"
      aspectRatio="550 / 1450"
      bottom={0}
      fetchPriority={fetchPriority}
      gridArea={{ lg: "illus" }}
      height="auto"
      justifySelf={{ lg: "center" }}
      left={0}
      loading="eager"
      marginInline="auto"
      maxW={{ base: "13rem", lg: "none" }}
      objectFit="contain"
      pointerEvents="none"
      position={{ base: "absolute", lg: "static" }}
      right={0}
      src={src}
      width={{ base: "100%", lg: "236px" }}
      zIndex={0}
    />
  );
}

export default function LandingPage() {
  const timeLeft = useCountdown();

  const countdownTiles = timeLeft
    ? [
        { value: timeLeft.days, label: "päivää" },
        { value: timeLeft.hours, label: "tuntia" },
        { value: timeLeft.minutes, label: "minuuttia" },
      ]
    : [];

  const hero = (
    <Box
      backgroundImage={`linear-gradient(to bottom, ${COLORS.bg} 50%, color-mix(in srgb, ${COLORS.accent} 28%, ${COLORS.bg}))`}
      display="flex"
      flexDirection="column"
      minH="100dvh"
      mt={`calc(-1 * ${HEADER_HEIGHT})`}
      position="relative"
      pt={{
        base: `calc(${HEADER_HEIGHT} + 1rem)`,
        md: `calc(${HEADER_HEIGHT} + 3rem)`,
        lg: `calc(${HEADER_HEIGHT} + 1.5rem)`,
      }}
    >
      <Box
        alignItems={{ lg: "center" }}
        columnGap={{ lg: "122px" }}
        display={{ base: "flex", lg: "grid" }}
        flex={1}
        flexDirection="column"
        gridTemplateAreas={{ lg: `"copy illus"` }}
        gridTemplateColumns={{ lg: "minmax(0, 593px) 236px" }}
        justifyContent={{ base: "space-between", lg: "center" }}
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
        {/* contents on mobile → heading + buttons become space-between flex siblings */}
        <Stack
          align={{ lg: "flex-start" }}
          display={{ base: "contents", lg: "flex" }}
          gap={8}
          gridArea={{ lg: "copy" }}
        >
          <Stack
            align={{ base: "center", lg: "flex-start" }}
            gap={0}
            position="relative"
            textAlign={{ base: "center", lg: "left" }}
            zIndex={1}
          >
            <Heading
              as="h1"
              fontSize={{ base: "4xl", md: "5xl", lg: "56px" }}
              fontWeight="semibold"
              lineHeight={1.1}
              textWrap="balance"
            >
              Löydä sopiva korkeakoulutus.
            </Heading>
            <Text color="fg.muted" fontSize={{ base: "lg", md: "2xl" }} fontWeight="medium" textWrap="pretty">
              Yhteishaun hakijamäärät, pisterajat ja koulutukset.
            </Text>
          </Stack>

          <HeroButtons />
        </Stack>

        <LandingIllustration fetchPriority="high" hideIn="_dark" src="/images/landing_illustration.png" />
        <LandingIllustration hideIn="_light" src="/images/landing_illustration_for_dark.png" />
      </Box>
    </Box>
  );

  const countdown = timeLeft && (
    <VStack>
      <Text color="fg.muted" fontSize={{ base: "xs", md: "md" }} letterSpacing="wide">
        {timeLeft.label} alkuun
      </Text>
      <SimpleGrid columns={3} gap={6} textAlign="center" width="100%">
        {countdownTiles.map(({ value, label }) => (
          <VStack gap={0} key={label}>
            <Text color="fg.accent" fontSize="2xl" fontWeight="bold">
              {value}
            </Text>
            <Text color="fg.muted" fontSize={{ base: "xs", md: "md" }}>
              {label}
            </Text>
          </VStack>
        ))}
      </SimpleGrid>
    </VStack>
  );

  const quickLinksSection = (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} width="100%">
      {quickLinks.map((link) => (
        <QuickLinkCard key={link.href} {...link} />
      ))}
    </SimpleGrid>
  );

  return (
    <>
      {hero}
      <Box
        as="section"
        backgroundImage={`linear-gradient(to bottom, color-mix(in srgb, ${COLORS.accent} 28%, ${COLORS.bg}), ${COLORS.bg} 20%)`}
      >
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
            {countdown}
            <IosInstallTip />
            {quickLinksSection}
          </VStack>
        </PageContainer>
      </Box>
    </>
  );
}
