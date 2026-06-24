import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" p={2} textAlign="center">
      <Text fontSize={{ base: "2xs", md: "xs" }} color="gray">
        Lähteet: Vipunen - opetushallinnon tilastopalvelu & Opintopolku.fi
      </Text>
    </Box>
  );
}
