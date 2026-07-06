import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { HiOutlineHeart } from "react-icons/hi";
import PageContainer from "@/layout/PageContainer";
import SchoolCard from "@/components/SchoolCard";
import useFavorites from "@/hooks/useFavorites";

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
    <PageContainer>
      {header}

      <Stack direction="column" gap={4}>
        {favorites.length === 0 ? (
          <Stack gap={1} align="center">
            <Text textAlign="center" color="fg.muted" fontSize="xs" letterSpacing="wide">
              Ei vielä tallennettuja koulutuksia.
            </Text>
            <Text textAlign="center" color="fg.muted" fontSize="xs">
              Voit tallentaa koulutuksia painamalla koulutuskortin{" "}
              <HiOutlineHeart style={{ display: "inline", marginBottom: 3 }} />
              -kuvaketta.
            </Text>
          </Stack>
        ) : null}
        {favorites.map((t, index) => (
          <SchoolCard key={`${t.toteutusOid} ${index}`} toteutus={t} />
        ))}
      </Stack>
    </PageContainer>
  );
}
