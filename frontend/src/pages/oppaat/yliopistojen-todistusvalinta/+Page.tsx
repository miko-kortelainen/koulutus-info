import GuideLayout from "@/pages/oppaat/components/GuideLayout";
import Content from "@/pages/oppaat/yliopistojen-todistusvalinta/content.mdx";
import source from "@/pages/oppaat/yliopistojen-todistusvalinta/content.mdx?raw";

export default function UniversityCertificateAdmissionGuidePage() {
  return <GuideLayout Content={Content} slug="yliopistojen-todistusvalinta" source={source} />;
}
