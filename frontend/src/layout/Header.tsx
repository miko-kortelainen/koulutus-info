import { Box, Link, Separator, Stack } from "@chakra-ui/react";

export default function Header() {
  return (
    <Box p={3} px={6}>
      <Stack direction="row" justifyContent={{ base: "center", md: "left" }} fontSize={{ base: "lg", md: "xl" }}>
        <Link>
          <a href="/">etusivu</a>
        </Link>

        <Separator orientation="vertical" />

        <Link>
          <a href="/hakijamaarat">hakijamäärät</a>
        </Link>

        <Separator orientation="vertical" />

        <Link>
          <a href="/koulutukset">koulutukset</a>
        </Link>
      </Stack>
    </Box>
  );
}
