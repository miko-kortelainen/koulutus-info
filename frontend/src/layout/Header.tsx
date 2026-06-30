import { Box, Link, Separator, Stack } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box as="header" p={3} px={6}>
      <Box as="nav" aria-label="Navigointi">
        <Stack
          as="ul"
          direction="row"
          justifyContent={{ base: "center", md: "left" }}
          fontSize={{ base: "md", md: "xl" }}
          gap={{ base: 5, md: 8 }}
        >
          <li>
            <Link as="a" href="/hakijamaarat">
              hakijamäärät
            </Link>
          </li>

          <li>
            <Link as="a" href="/koulutukset">
              koulutukset
            </Link>
          </li>

          <li>
            <Link as="a" href="/trendit">
              trendit
            </Link>
          </li>

          <li>
            <Link as="a" href="/hukassa">
              hukassa?
            </Link>
          </li>
        </Stack>
        <Separator aria-hidden="true" mt={{ base: 2, md: 3 }} />
      </Box>
    </Box>
  );
}
