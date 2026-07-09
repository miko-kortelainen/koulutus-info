import { Box, Link, Stack, Text } from "@chakra-ui/react";
import useMetaQuery from "@/hooks/useMetaQuery";

export default function Footer() {
  const { data } = useMetaQuery();

  return (
    <Box as="footer" p={2} textAlign="center">
      <Stack alignItems="center" gap={1}>
        <Link color="gray" fontSize={{ base: "2xs", md: "xs" }} href="/tietosuojaseloste/">
          Tietosuojaseloste
        </Link>
        {data && (
          <Text color="gray" fontSize={{ base: "2xs", md: "xs" }}>
            Tiedot päivitetty {new Date(data.generatedAt).toLocaleDateString("fi-FI")}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
