import { Heading, Separator, Stack, Text } from "@chakra-ui/react";
import { flushSync } from "react-dom";
import { HiOutlineHeart } from "react-icons/hi";
import SchoolCard from "@/components/SchoolCard";
import useFavorites from "@/hooks/useFavorites";
import PageContainer from "@/layout/PageContainer";

export default function SavedListPage() {
  const { favorites, moveFavorite } = useFavorites();

  const move = (oid: string, direction: -1 | 1) => {
    if (typeof document.startViewTransition !== "function") {
      moveFavorite(oid, direction);
      return;
    }
    document.startViewTransition(() => flushSync(() => moveFavorite(oid, direction)));
  };

  const header = (
    <Stack gap={1}>
      <Heading as="h1" size="lg">
        Oma hakulista
      </Heading>
      <Text color="fg.muted">Yhteishaun hakusuunnitelmasi.</Text>
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
            Voit tallentaa koulutuksia painamalla koulutukset- sivulla koulutuskortin{" "}
            <HiOutlineHeart style={{ display: "inline", marginBottom: 3 }} />
            -kuvaketta.
          </Text>
        </Stack>
      ) : (
        <Stack as="ul" direction="column" gap={4} listStyleType="none">
          {favorites.map((t, i) => (
            <SchoolCard
              index={i + 1}
              key={t.toteutusOid}
              onMoveDown={i < favorites.length - 1 ? () => move(t.toteutusOid, 1) : undefined}
              onMoveUp={i > 0 ? () => move(t.toteutusOid, -1) : undefined}
              toteutus={t}
            />
          ))}
        </Stack>
      )}

      <Text color="fg.muted" fontSize="xs" lineHeight="tall" mt={2} textWrap="pretty">
        Voit hakea kussakin korkeakoulujen yhteishaussa korkeintaan{" "}
        <Text as="span" fontWeight="bold">
          kuuteen
        </Text>{" "}
        eri koulutukseen.
      </Text>
    </PageContainer>
  );
}
