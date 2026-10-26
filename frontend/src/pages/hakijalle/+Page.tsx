import ToolsPage from "@/components/quickLinks/ToolsPage";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";

export default function HakijallePage() {
  return (
    <>
      <PageIntro description="Työkaluja toisen asteen ja korkeakoulutuksen hakijalle." title="Hakijalle" />
      <PageContainer align="flex-start">
        <ToolsPage />
      </PageContainer>
    </>
  );
}
