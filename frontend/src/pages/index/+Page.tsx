import { Box, Button, Heading, HStack, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { motion, useScroll, useTransform } from "motion/react";
import { HiOutlineArrowRight, HiOutlineCalculator, HiOutlineChartBar } from "react-icons/hi";
import { HEADER_HEIGHT } from "@/layout/Header";
import PageContainer from "@/layout/PageContainer";
import IosInstallTip from "@/pages/index/components/IosInstallTip";
import LandingHeadline from "@/pages/index/components/LandingHeadline";
import QuickLinkCard from "@/pages/index/components/QuickLinkCard";
import { quickLinks } from "@/pages/index/components/quickLinks";
import useCountdown from "@/pages/index/hooks/useCountdown";
import { COLORS } from "@/theme";

const MotionDiv = motion.div;
const MotionVStack = motion.create(VStack);

const heroLinks = [
  { href: "/pistelaskuri/", icon: HiOutlineCalculator, label: "Laske todistuspisteeni" },
  { href: "/hakijamaarat/", icon: HiOutlineChartBar, label: "Näytä hakijamäärät" },
];

function HeroButtons() {
  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 3, md: 4, lg: 8 }}
      width={{ base: "100%", lg: "auto" }}
    >
      {heroLinks.map(({ href, icon: Icon, label }, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 8 }}
          key={href}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            _active={{ transform: "scale(0.96)" }}
            _hover={{ bg: "accentFg", color: "bg" }}
            asChild
            bg="accent"
            color="onAccent"
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
        </motion.div>
      ))}
    </Stack>
  );
}

function LandingBackground() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <Box aria-hidden="true" inset={0} overflow="hidden" pointerEvents="none" position="absolute" zIndex={0}>
      <MotionDiv aria-hidden="true" style={{ y }}>
        <Image
          alt=""
          fetchPriority="high"
          height={{ base: "100vh", md: "100%" }}
          loading="eager"
          objectFit="cover"
          objectPosition="center"
          src="/images/nature.jpg"
          width="100%"
        />
      </MotionDiv>
      <Box
        backgroundImage={{
          _light: `linear-gradient(to bottom, color-mix(in srgb, ${COLORS.bg} 8%, transparent) 70%, ${COLORS.bg})`,
          _dark: `linear-gradient(to bottom, color-mix(in srgb, ${COLORS.bg} 42%, transparent) 60%, ${COLORS.bg})`,
        }}
        inset={0}
        position="absolute"
      />
    </Box>
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
      display="flex"
      flexDirection="column"
      minH="100dvh"
      mt={`calc(-1 * ${HEADER_HEIGHT})`}
      overflow="hidden"
      position="relative"
      pt={{
        base: `calc(${HEADER_HEIGHT} + 1rem)`,
        md: `calc(${HEADER_HEIGHT} + 3rem)`,
        lg: `calc(${HEADER_HEIGHT} + 1.5rem)`,
      }}
    >
      <LandingBackground />
      <Box
        display="flex"
        flex={1}
        flexDirection="column"
        justifyContent="center"
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

  const countdown = timeLeft && (
    <MotionVStack
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <Text color="fg.muted" fontSize={{ base: "xs", md: "md" }} letterSpacing="wide">
        {timeLeft.label} alkuun
      </Text>
      <SimpleGrid columns={3} gap={6} textAlign="center" width="100%">
        {countdownTiles.map(({ value, label }, index) => (
          <MotionVStack
            animate={{ opacity: 1, scale: 1, y: 0 }}
            gap={0}
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            key={label}
            transition={{ duration: 0.5, delay: 0.7 + index * 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <Text color="fg.accent" fontSize="2xl" fontWeight="bold">
              {value}
            </Text>
            <Text color="fg.muted" fontSize={{ base: "xs", md: "md" }}>
              {label}
            </Text>
          </MotionVStack>
        ))}
      </SimpleGrid>
    </MotionVStack>
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
            {countdown}
            <IosInstallTip />
            {quickLinksSection}
          </VStack>
        </PageContainer>
      </Box>
    </>
  );
}
