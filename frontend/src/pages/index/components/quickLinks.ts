import {
  HiOutlineAcademicCap,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineLibrary,
  HiOutlineOfficeBuilding,
  HiOutlineTrendingUp,
} from "react-icons/hi";

export const quickLinkSections = [
  {
    heading: "Toinen aste",
    id: "toinen-aste",
    links: [
      {
        href: "/lukiot/",
        label: "lukiot",
        description: "Katso lukioiden keskiarvorajat",
        icon: HiOutlineOfficeBuilding,
      },
    ],
  },
  {
    heading: "Korkeakoulutus",
    id: "korkeakoulutus",
    links: [
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
        href: "/hakijamaarat/",
        label: "hakijamäärät",
        description: "Katso yhteishakujen hakijamääriä",
        icon: HiOutlineChartBar,
      },
      {
        href: "/koulut/",
        label: "koulut",
        description: "Katso koulujen pisterajat ja hakijamäärät",
        icon: HiOutlineLibrary,
      },
      {
        href: "/trendit/",
        label: "trendit",
        description: "Katso suosituimmat alat ja koulut",
        icon: HiOutlineTrendingUp,
      },
    ],
  },
];
