import { Box, Link, Separator, Stack } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box as="header" p={3} px={6}>
      <Box as="nav" aria-label="Päävalikko">
        <Stack
          as="ul"
          direction="row"
          justifyContent={{ base: "center", md: "left" }}
          fontSize={{ base: "lg", md: "xl" }}
          listStyleType="none"
          p={0}
          m={0}
        >
          <li>
            <Link as="a" href="/">
              etusivu
            </Link>
          </li>
          <li aria-hidden="true">
            <Separator orientation="vertical" />
          </li>
          <li>
            <Link as="a" href="/hakijamaarat">
              hakijamäärät
            </Link>
          </li>
          <li aria-hidden="true">
            <Separator orientation="vertical" />
          </li>
          <li>
            <Link as="a" href="/koulutukset">
              koulutukset
            </Link>
          </li>
          <li aria-hidden="true">
            <Separator orientation="vertical" />
          </li>
          <li>
            <Link as="a" href="/trendit">
              trendit
            </Link>
          </li>
        </Stack>
      </Box>
    </Box>
  );
}
