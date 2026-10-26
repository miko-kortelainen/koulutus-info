import { useState } from "react";
import { HiOutlineBookOpen, HiOutlineChartBar, HiOutlineClipboardList, HiOutlineTrendingUp } from "react-icons/hi";
import { quickLinkSections } from "@/components/quickLinks/quickLinks";
import QuickLinkTabs from "@/components/quickLinks/QuickLinkTabs";

const sections = [
  quickLinkSections[0],
  {
    ...quickLinkSections[1],
    links: [
      ...quickLinkSections[1].links,
      {
        href: "/pisterajat/",
        label: "pisterajat",
        description: "Katso koulutusten pisterajat",
        icon: HiOutlineChartBar,
      },
      {
        href: "/oma-hakulista/",
        label: "oma hakulista",
        description: "Kokoa kiinnostavat koulutukset",
        icon: HiOutlineClipboardList,
      },
      { href: "/oppaat/", label: "oppaat", description: "Tutustu valintatapojen oppaisiin", icon: HiOutlineBookOpen },
      {
        href: "/hakijaprofiili/",
        label: "hakijaprofiili",
        description: "Tutki hakijoiden taustatietoja",
        icon: HiOutlineChartBar,
      },
      {
        href: "/ennakointi/",
        label: "ennakointi",
        description: "Tutki tulevaisuuden koulutustarpeita",
        icon: HiOutlineTrendingUp,
      },
    ],
  },
];

export default function ToolsPage() {
  const [section, setSection] = useState(sections[0].id);

  return <QuickLinkTabs onValueChange={setSection} sections={sections} value={section} />;
}
