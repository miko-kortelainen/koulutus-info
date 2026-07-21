import {
  HiOutlineAcademicCap,
  HiOutlineBookmark,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineLibrary,
  HiOutlineTrendingUp,
} from "react-icons/hi";

export const quickLinks = [
  {
    href: "/pistelaskuri/",
    label: "pistelaskuri",
    description: "Yhteishaun todistusvalintapistelaskuri",
    icon: HiOutlineCalculator,
  },
  {
    href: "/koulutukset/",
    label: "koulutukset",
    description: "Syksyn 2026 yhteishaun koulutustarjonta",
    icon: HiOutlineAcademicCap,
  },
  {
    href: "/oma-hakulista/",
    label: "oma hakulista",
    description: "Tallenna ja järjestä omat hakukohteesi",
    icon: HiOutlineBookmark,
  },
  {
    href: "/hakijamaarat/",
    label: "hakijamäärät",
    description: "Edellisvuosien hakijamääriä koulutuksittain",
    icon: HiOutlineChartBar,
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
