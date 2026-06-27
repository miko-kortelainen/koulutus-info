import { Box, Link, Stack } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Box as="footer" p={2} textAlign="center">
      <Stack gap={1} alignItems="center">
        <Link href="/tietosuojaseloste" fontSize={{ base: "2xs", md: "xs" }} color="gray">
          Tietosuojaseloste
        </Link>
      </Stack>
    </Box>
  );
}
