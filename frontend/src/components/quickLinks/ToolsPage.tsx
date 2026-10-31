import { HiOutlineBookOpen, HiOutlineChartBar, HiOutlineClipboardList, HiOutlineTrendingUp } from "react-icons/hi";
import QuickLinkTabs from "@/components/quickLinks/QuickLinkTabs";
import { quickLinkSections } from "@/components/quickLinks/quickLinks";
import useEducationLevel from "@/components/quickLinks/useEducationLevel";

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

export default function ToolsPage({ rememberSelection = false }: { rememberSelection?: boolean }) {
  const [section, selectSection] = useEducationLevel(rememberSelection);

  return <QuickLinkTabs onValueChange={selectSection} sections={sections} value={section} />;
}
