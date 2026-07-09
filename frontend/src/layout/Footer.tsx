import { Box, Link, Stack, Text } from "@chakra-ui/react";
import useMetaQuery from "@/hooks/useMetaQuery";

export default function Footer() {
  const { data } = useMetaQuery();

  return (
    <Box as="footer" p={2} textAlign="center">
      <Stack gap={1} alignItems="center">
        <Link href="/tietosuojaseloste/" fontSize={{ base: "2xs", md: "xs" }} color="gray">
          Tietosuojaseloste
        </Link>
        {data && (
          <Text fontSize={{ base: "2xs", md: "xs" }} color="gray">
            Tiedot päivitetty {new Date(data.generatedAt).toLocaleDateString("fi-FI")}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
