import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { HiOutlineHeart } from "react-icons/hi";
import SchoolCard from "@/components/SchoolCard";
import useFavorites from "@/hooks/useFavorites";
import PageContainer from "@/layout/PageContainer";

export default function SavedListPage() {
  const { favorites } = useFavorites();

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Tallennetut
      </Heading>
      <Text color="fg.muted">Yhteishaun koulutukset, jotka olet tallentanut myöhempää tarkastelua varten.</Text>
      <Separator mt={2} />
    </Stack>
  );

  return (
    <PageContainer align="flex-start">
      {header}

      {favorites.length === 0 ? (
        <Stack align="center" gap={1}>
          <Text color="fg.muted" fontSize="xs" letterSpacing="wide" textAlign="center">
            Ei vielä tallennettuja koulutuksia.
          </Text>
          <Text color="fg.muted" fontSize="xs" textAlign="center">
            Voit tallentaa koulutuksia painamalla koulutuskortin{" "}
            <HiOutlineHeart style={{ display: "inline", marginBottom: 3 }} />
            -kuvaketta.
          </Text>
        </Stack>
      ) : (
        <Stack as="ul" direction="column" gap={4} listStyleType="none">
          {favorites.map((t) => (
            <SchoolCard key={t.toteutusOid} toteutus={t} />
          ))}
        </Stack>
      )}
    </PageContainer>
  );
}
