import { Box, Link, Stack } from "@chakra-ui/react";
import { useData } from "vike-react/useData";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { slugify } from "@/lib/slug";

export default function LukiotKaupungitPage() {
  const kunnat = useData<string[]>();
  return (
    <>
      <PageIntro
        description={`Valitse kunta ja katso lukioiden keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}.`}
        title="Lukiot kunnittain"
      />
      <PageContainer align="flex-start">
        <Stack as="ul" gap={2} listStyleType="none">
          {kunnat.map((kunta) => (
            <Box as="li" key={kunta}>
              <Link href={`/lukiot/kaupungit/${slugify(kunta)}/`} textDecoration="underline">
                {kunta}
              </Link>
            </Box>
          ))}
        </Stack>
      </PageContainer>
    </>
  );
}
