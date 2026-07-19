import { Box, Flex, HStack, Image, Link, SimpleGrid, Text, VStack } from "@chakra-ui/react";

const FOOTER_LINKS = [
  ["Pistelaskuri", "/pistelaskuri/"],
  ["Koulutukset", "/koulutukset/"],
  ["Oppaat", "/oppaat/"],
  ["UKK", "/ukk/"],
  ["Tietosuojaseloste", "/tietosuojaseloste/"],
  ["Koulut", "/koulut/"],
  ["Anna palautetta", "/palaute/"],
] as const;

export default function Footer() {
  return (
    <Box as="footer" borderColor="border" borderTopWidth="1px" minH="8rem" mt={12} p={4}>
      <Flex direction="column" gap={6} margin="0 auto" maxW="60rem">
        <VStack align="flex-start" gap={0}>
          <HStack gap={2}>
            <Image alt="" boxSize={6} src="/images/logo.png" />
            <Text fontSize="lg" fontWeight="bold" letterSpacing="widest">
              yhteishaku
              <Text as="span" color="fg.accent">
                .app
              </Text>
            </Text>
          </HStack>
          <Text color="fg.muted" fontSize="sm">
            Korkeakouluun pyrkivän paras työkalu!
          </Text>
        </VStack>
        <SimpleGrid aria-label="Alatunnisteen navigointi" as="nav" columnGap={4} columns={2} rowGap={2}>
          {FOOTER_LINKS.map(([label, href]) => (
            <Link color="fg.muted" fontSize="xs" href={href} key={href}>
              {label}
            </Link>
          ))}
        </SimpleGrid>
      </Flex>
    </Box>
  );
}
