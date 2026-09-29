import { TOINEN_ASTE_ROUNDS, YHTEISHAKU_ROUNDS } from "@/config/season";
import {
  HiOutlineAcademicCap,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineLibrary,
  HiOutlineOfficeBuilding,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
} from "react-icons/hi";

export const quickLinkSections = [
  {
    heading: "Toinen aste",
    id: "toinen-aste",
    rounds: TOINEN_ASTE_ROUNDS,
    links: [
      {
        href: "/lukiot/",
        label: "lukiot",
        description: "Katso lukioiden keskiarvorajat",
        icon: HiOutlineOfficeBuilding,
      },
      {
        href: "/yo-pisterajat/",
        label: "yo-kokeiden pisterajat",
        description: "Katso ylioppilaskokeiden pisterajat",
        icon: HiOutlineSparkles,
      },
    ],
  },
  {
    heading: "Korkeakoulutus",
    id: "korkeakoulutus",
    rounds: YHTEISHAKU_ROUNDS,
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
