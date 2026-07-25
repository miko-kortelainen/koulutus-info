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
    description: "Laske yhteishaun todistusvalintapisteesi",
    icon: HiOutlineCalculator,
  },
  {
    href: "/koulutukset/",
    label: "koulutukset",
    description: "Katso yhteishaussa olevat koulutukset",
    icon: HiOutlineAcademicCap,
  },
  {
    href: "/oma-hakulista/",
    label: "oma hakulista",
    description: "Valitse yhteishaun hakukohteesi",
    icon: HiOutlineBookmark,
  },
  {
    href: "/hakijamaarat/",
    label: "hakijamäärät",
    description: "Katso yhteishakujen hakijamääriä",
    icon: HiOutlineChartBar,
  },
  {
    href: "/koulut/",
    label: "koulut",
    description: "Katso koulujen pisterajat ja hakijamäärät.",
    icon: HiOutlineLibrary,
  },
  {
    href: "/trendit/",
    label: "trendit",
    description: "Katso suosituimmat alat ja koulut",
    icon: HiOutlineTrendingUp,
  },
];
