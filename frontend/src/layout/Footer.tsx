import { Box, Link, Stack, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" p={2} textAlign="center">
      <Stack gap={1} alignItems="center">
        <Text fontSize={{ base: "2xs", md: "xs" }} color="gray">
          Lähteet: Vipunen - opetushallinnon tilastopalvelu & Opintopolku.fi
        </Text>
        <Link href="/tietosuojaseloste" fontSize={{ base: "2xs", md: "xs" }} color="gray">
          Tietosuojaseloste
        </Link>
      </Stack>
    </Box>
  );
}
