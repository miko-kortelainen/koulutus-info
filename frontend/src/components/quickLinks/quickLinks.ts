import { TOINEN_ASTE_ROUNDS, YHTEISHAKU_ROUNDS } from "@/config/season";
import {
  HiOutlineAcademicCap,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineClipboardList,
  HiOutlineLibrary,
  HiOutlineOfficeBuilding,
  HiOutlineSparkles,
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
      {
        href: "/hakijamaarat/toinen-aste/",
        label: "hakijamäärät",
        description: "Katso toisen asteen yhteishaun hakijamääriä",
        icon: HiOutlineChartBar,
      },
    ],
  },
  {
    heading: "Korkeakoulutus",
    id: "korkeakoulutus",
    rounds: YHTEISHAKU_ROUNDS,
    links: [
      {
        href: "/oma-hakulista/",
        label: "oma hakulista",
        description: "Kokoa kiinnostavat koulutukset",
        icon: HiOutlineClipboardList,
      },
      {
        href: "/todistusvalintalaskuri/",
        label: "todistusvalintalaskuri",
        description: "Laske yhteishaun todistusvalintapisteesi",
        icon: HiOutlineCalculator,
      },
      {
        href: "/pisterajat/",
        label: "pisterajat",
        description: "Katso alojen ja koulutusten pisterajat",
        icon: HiOutlineChartBar,
      },
      {
        href: "/hakijamaarat/korkeakoulut/",
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
        href: "/koulutukset/",
        label: "koulutukset",
        description: "Katso yhteishaussa olevat koulutukset",
        icon: HiOutlineAcademicCap,
      },
    ],
  },
];
