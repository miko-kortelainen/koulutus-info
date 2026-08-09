import GuideLayout from "@/pages/oppaat/components/GuideLayout";
import Content from "@/pages/oppaat/ammattikorkeakoulujen-todistusvalinta/content.mdx";
import source from "@/pages/oppaat/ammattikorkeakoulujen-todistusvalinta/content.mdx?raw";

export default function UniversityOfAppliedSciencesCertificateAdmissionGuidePage() {
  return <GuideLayout Content={Content} slug="ammattikorkeakoulujen-todistusvalinta" source={source} />;
}
