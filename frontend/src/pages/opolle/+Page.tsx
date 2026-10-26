import { Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import { HiOutlineChatAlt2, HiOutlineMail, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import QuickLinkCard from "@/components/quickLinks/QuickLinkCard";
import ToolsPage from "@/components/quickLinks/ToolsPage";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

export default function OpollePage() {
  return (
    <>
      <PageIntro description="Työkaluja toisen asteen ja korkeakoulutuksen opinto-ohjaukseen." title="Opolle" />
      <PageContainer align="flex-start">
        <ToolsPage />
        <Stack as="section" gap={4} mt={6}>
          <Heading as="h2" size="md">
            Tietoa tästä sivustosta
          </Heading>
          <SimpleGrid as="ul" columns={{ base: 1, md: 2 }} gap={6} listStyleType="none">
            <li>
              <QuickLinkCard
                description="Tietojen lähteet ja päivittyminen"
                href="/ukk/"
                icon={HiOutlineQuestionMarkCircle}
                label="usein kysytyt kysymykset"
              />
            </li>
            <li>
              <QuickLinkCard
                description="Kerro virheestä tai lähetä kehitysehdotus"
                href="/palaute/"
                icon={HiOutlineChatAlt2}
                label="anna palautetta"
              />
            </li>
            <li>
              <QuickLinkCard
                description="Ota yhteyttä sivuston ylläpitäjään"
                href="mailto:miko@kortelainen.dev"
                icon={HiOutlineMail}
                label="ota yhteyttä"
              />
            </li>
          </SimpleGrid>
        </Stack>
      </PageContainer>
    </>
  );
}
