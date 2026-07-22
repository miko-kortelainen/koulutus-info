import { Group, Heading, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import IosInstallTip from "./components/IosInstallTip";
import QuickLinkCard from "./components/QuickLinkCard";
import { quickLinks } from "./components/quickLinks";
import useCountdown from "./hooks/useCountdown";

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
    <VStack alignItems="center" gap={{ base: "14", md: "20" }} textAlign="center">
      <Stack gap={{ base: "2", md: "7" }}>
        <VStack gap={0}>
          <Group flexDir="column">
            <Image alt="yhteishaku.app" boxSize={{ base: "16", md: "28" }} src="/images/logo.png" />
            <Heading as="h1" fontWeight="bold" letterSpacing="widest" size={{ base: "3xl", md: "5xl" }}>
              yhteishaku
              <Text as="span" color="fg.accent">
                .app
              </Text>
            </Heading>
          </Group>

          <Text color="fg.muted" fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" textWrap="pretty">
            Korkeakouluun pyrkivän paras työkalu!
          </Text>
        </VStack>
      </Stack>
    </VStack>
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
    <PageContainer>
      <VStack flex={1} gap={10} justifyContent="center">
        {hero}
        {countdown}
        <IosInstallTip />
        {quickLinksSection}
      </VStack>
    </PageContainer>
  );
}
