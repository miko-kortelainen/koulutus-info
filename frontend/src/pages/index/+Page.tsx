import { Group, Heading, Image, SimpleGrid, Stack, Text, VStack } from "@chakra-ui/react";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "../../theme";
import useCountdown from "./hooks/useCountdown";
import QuickLinkCard from "./components/QuickLinkCard";
import { quickLinks } from "./components/quickLinks";

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
    <VStack gap={{ base: "14", md: "20" }} textAlign="center" alignItems="center">
      <Stack gap={{ base: "2", md: "7" }}>
        <VStack gap={0}>
          <Group flexDir="column">
            <Image src="/images/logo.png" alt="yhteishaku.app" boxSize={{ base: "16", md: "28" }} />
            <Heading as="h1" size={{ base: "3xl", md: "5xl" }} fontWeight="bold" letterSpacing="widest">
              yhteishaku.app
            </Heading>
          </Group>

          <Text fontSize={{ base: "sm", md: "md" }} color="fg.muted" fontWeight="semibold" textWrap="pretty">
            Opiskelemaan pyrkivän paras työkalu!
          </Text>
        </VStack>
      </Stack>
    </VStack>
  );

  const countdown = timeLeft && (
    <VStack>
      <Text fontSize={{ base: "xs", md: "md" }} color="fg.muted" letterSpacing="wide">
        {timeLeft.label} alkuun
      </Text>
      <SimpleGrid columns={3} gap={6} textAlign="center" width="100%">
        {countdownTiles.map(({ value, label }) => (
          <VStack key={label} gap={0}>
            <Heading size="2xl" color={COLORS.accent}>
              {value}
            </Heading>
            <Text fontSize={{ base: "xs", md: "md" }} color="fg.muted">
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
      <VStack gap={10} flex={1} justifyContent="center">
        {hero}
        {countdown}
        {quickLinksSection}
      </VStack>
    </PageContainer>
  );
}
