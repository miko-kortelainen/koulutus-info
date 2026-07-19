import { Center, Heading, Stack, Text } from "@chakra-ui/react";
import { usePageContext } from "vike-react/usePageContext";

export default function ErrorPage() {
  const { is404 } = usePageContext();

  return (
    <Center flex={1}>
      <Stack gap={4} textAlign="center">
        <Heading as="h1" size="5xl">
          {is404 ? "404" : "Virhe"}
        </Heading>
        <Text color="fg.muted">{is404 ? "Sivua ei löydy." : "Jotain meni vikaan. Yritä uudelleen."}</Text>
      </Stack>
    </Center>
  );
}
