import { Box, Link, Separator, Stack } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box as="header" p={3} px={6}>
      <Stack
        as="nav"
        aria-label="Päävalikko"
        direction="row"
        justifyContent={{ base: "center", md: "left" }}
        fontSize={{ base: "lg", md: "xl" }}
      >
        <Link as="a" href="/">
          etusivu
        </Link>

        <Separator orientation="vertical" />

        <Link as="a" href="/hakijamaarat">
          hakijamäärät
        </Link>

        <Separator orientation="vertical" />

        <Link as="a" href="/koulutukset">
          koulutukset
        </Link>
      </Stack>
    </Box>
  );
}
