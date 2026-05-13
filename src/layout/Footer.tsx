import { Box, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box p={2} textAlign="center">
      <Text fontSize={"xs"} color={"gray"}>
        made by Miko Kortelainen | tilastojen lähde: Vipunen - opetushallinnon tilastopalvelu
      </Text>
    </Box>
  );
}
