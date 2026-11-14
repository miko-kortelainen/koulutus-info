import {
  HiOutlineBookOpen,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import QuickLinkTabs from "@/components/quickLinks/QuickLinkTabs";
import { quickLinkSections } from "@/components/quickLinks/quickLinks";
import useEducationLevel from "@/components/quickLinks/useEducationLevel";

const trendit = {
  href: "/trendit/",
  label: "trendit",
  description: "Katso suosituimmat alat ja koulut",
  icon: HiOutlineTrendingUp,
};

const sections = [
  quickLinkSections[0],
  {
    ...quickLinkSections[1],
    links: [
      ...quickLinkSections[1].links,
      {
        href: "/tyollistyminen/",
        label: "työllistyminen ja palkat",
        description: "Katso alojen työllistyminen ja palkat",
        icon: HiOutlineBriefcase,
      },
      {
        href: "/ennakointi/",
        label: "ennakointi",
        description: "Tutki tulevaisuuden koulutustarpeita",
        icon: HiOutlineTrendingUp,
      },
      trendit,
      {
        href: "/hakijaprofiili/",
        label: "hakijaprofiili",
        description: "Tutki hakijoiden taustatietoja",
        icon: HiOutlineChartBar,
      },
      { href: "/oppaat/", label: "oppaat", description: "Tutustu valintatapojen oppaisiin", icon: HiOutlineBookOpen },
    ],
  },
];

export default function ToolsPage({
  rememberSelection = false,
  hideOmaHakulista = false,
}: {
  rememberSelection?: boolean;
  hideOmaHakulista?: boolean;
}) {
  const [section, selectSection] = useEducationLevel(rememberSelection);
  const visibleSections = hideOmaHakulista
    ? sections.map((item) => ({ ...item, links: item.links.filter((link) => link.href !== "/oma-hakulista/") }))
    : sections;

  return <QuickLinkTabs onValueChange={selectSection} sections={visibleSections} value={section} />;
}
