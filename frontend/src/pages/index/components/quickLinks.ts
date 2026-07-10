import { HiOutlineAcademicCap, HiOutlineChartBar, HiOutlineLibrary, HiOutlineTrendingUp } from "react-icons/hi";

export const quickLinks = [
  {
    href: "/hakijamaarat/",
    label: "hakijamäärät",
    description: "Edellisvuosien hakijamääriä koulutuksittain",
    icon: HiOutlineChartBar,
  },
  {
    href: "/koulutukset/",
    label: "koulutukset",
    description: "Syksyn 2026 yhteishaussa olevat koulutukset",
    icon: HiOutlineAcademicCap,
  },
  {
    href: "/koulut/",
    label: "koulut",
    description: "Koulujen pisterajat, hakijamäärät ja koulutukset",
    icon: HiOutlineLibrary,
  },
  {
    href: "/trendit/",
    label: "trendit",
    description: "Suositumpien alojen ja koulujen vertailu",
    icon: HiOutlineTrendingUp,
  },
];
