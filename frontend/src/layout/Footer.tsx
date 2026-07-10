import { Box, Link, Stack, Text } from "@chakra-ui/react";
import useMetaQuery from "@/hooks/useMetaQuery";

export default function Footer() {
  const { data } = useMetaQuery();
  const formatDate = (date: string) => new Date(date).toLocaleDateString("fi-FI");

  return (
    <Box as="footer" p={2} textAlign="center">
      <Stack alignItems="center" gap={1}>
        <Link color="gray" fontSize={{ base: "2xs", md: "xs" }} href="/tietosuojaseloste/">
          Tietosuojaseloste
        </Link>
        {data && (
          <Text color="gray" fontSize={{ base: "2xs", md: "xs" }}>
            {data.statisticsUpdatedAt && `Tilastot päivitetty ${formatDate(data.statisticsUpdatedAt)}`}
            {data.statisticsUpdatedAt && data.programmesUpdatedAt && " · "}
            {data.programmesUpdatedAt && `Koulutustarjonta päivitetty ${formatDate(data.programmesUpdatedAt)}`}
          </Text>
        )}
      </Stack>
    </Box>
  );
}
