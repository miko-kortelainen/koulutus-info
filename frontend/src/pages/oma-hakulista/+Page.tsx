import { Stack, Text } from "@chakra-ui/react";
import { flushSync } from "react-dom";
import { HiOutlineHeart } from "react-icons/hi";
import SchoolCard from "@/components/SchoolCard";
import useFavorites from "@/hooks/useFavorites";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

export default function SavedListPage() {
  const { favorites, moveFavorite } = useFavorites();

  const move = (oid: string, direction: -1 | 1) => {
    if (typeof document.startViewTransition !== "function") {
      moveFavorite(oid, direction);
      return;
    }
    document.startViewTransition(() => flushSync(() => moveFavorite(oid, direction)));
  };

  return (
    <>
      <PageIntro description="Yhteishaun hakusuunnitelmasi." title="Oma hakulista" />
      <PageContainer align="flex-start">
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
    </>
  );
}
