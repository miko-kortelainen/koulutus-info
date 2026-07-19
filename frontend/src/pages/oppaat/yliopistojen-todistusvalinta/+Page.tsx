import GuideLayout from "../components/GuideLayout";
import Content from "./content.mdx";
import source from "./content.mdx?raw";

export default function UniversityCertificateAdmissionGuidePage() {
  return <GuideLayout Content={Content} slug="yliopistojen-todistusvalinta" source={source} />;
}
