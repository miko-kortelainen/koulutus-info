import { Box, Button, Heading, HStack, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import { HiOutlineArrowRight, HiOutlineCalculator, HiOutlineChartBar } from "react-icons/hi";

import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import IosInstallTip from "./components/IosInstallTip";
import QuickLinkCard from "./components/QuickLinkCard";
import { quickLinks } from "./components/quickLinks";
import useCountdown from "./hooks/useCountdown";

const heroLinks = [
  { href: "/pistelaskuri/", icon: HiOutlineCalculator, label: "Laske todistuspisteeni" },
  { href: "/hakijamaarat/", icon: HiOutlineChartBar, label: "Näytä hakijamäärät" },
];

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
      backgroundImage={`linear-gradient(to bottom, ${COLORS.bg} 50%, color-mix(in srgb, ${COLORS.accent} 42%, ${COLORS.bg}))`}
      display="flex"
      minH="calc(100svh - 3.5rem)"
      py={{ base: 10, md: 12, lg: 6 }}
    >
      <SimpleGrid
        alignItems="center"
        flex={1}
        gap={{ base: 8, lg: "122px" }}
        gridTemplateColumns={{ base: "1fr", lg: "minmax(0, 593px) 236px" }}
        margin="0 auto"
        maxW="65rem"
        px={{ base: 4, md: 6, lg: 0 }}
        transform={{ lg: "translateY(-1.75rem)" }}
      >
        <Stack align={{ base: "center", lg: "flex-start" }} gap={8} textAlign={{ base: "center", lg: "left" }}>
          <Stack gap={0}>
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

          <Stack
            direction={{ base: "column", md: "row" }}
            gap={{ base: 4, md: 8 }}
            width={{ base: "100%", md: "auto" }}
          >
            {heroLinks.map(({ href, icon: Icon, label }) => (
              <Button
                _hover={{ bg: "accentFg" }}
                asChild
                bg="accent"
                color="text"
                key={href}
                variant="solid"
                width={{ base: "100%", md: "236px" }}
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
        </Stack>

        <Image
          alt=""
          fetchPriority="high"
          justifySelf="center"
          src="/images/landing_illustration.png"
          width={{ base: "10rem", md: "11rem", lg: "236px" }}
        />
      </SimpleGrid>
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
        backgroundImage={`linear-gradient(to bottom, color-mix(in srgb, ${COLORS.accent} 42%, ${COLORS.bg}), ${COLORS.bg} 18%)`}
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
