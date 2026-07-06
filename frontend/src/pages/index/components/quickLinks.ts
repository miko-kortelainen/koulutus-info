import { HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineLibrary, HiOutlineTrendingUp } from "react-icons/hi";

export const quickLinks = [
  {
    href: "/hakijamaarat/",
    label: "hakijamäärät",
    description: "Katso hakijamäärät koulutuksittain",
    icon: HiOutlineChartBar,
  },
  {
    href: "/koulutukset/",
    label: "koulutukset",
    description: "Selaa yhteishaussa olevia koulutuksia",
    icon: HiOutlineAcademicCap,
  },
  {
    href: "/koulut/",
    label: "koulut",
    description: "Selaa korkeakouluja ja niiden tilastoja",
    icon: HiOutlineLibrary,
  },
  {
    href: "/trendit/",
    label: "trendit",
    description: "Vertaa alojen ja koulujen hakijamääriä",
    icon: HiOutlineTrendingUp,
  },
];
