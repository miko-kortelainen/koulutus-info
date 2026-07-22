import GuideLayout from "../components/GuideLayout";
import Content from "./content.mdx";
import source from "./content.mdx?raw";

export default function UniversityOfAppliedSciencesCertificateAdmissionGuidePage() {
  return <GuideLayout Content={Content} slug="ammattikorkeakoulujen-todistusvalinta" source={source} />;
}
