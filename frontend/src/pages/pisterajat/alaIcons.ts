import {
  Atom,
  Bank,
  Code,
  Cutlery,
  Globe,
  GraduationCap,
  Heart,
  Hospital,
  OpenBook,
  Palette,
  Settings,
  Tree,
} from "iconoir-react";
import type { ComponentType } from "react";

/** Icons keyed by exact `koulutusala` from cutoff data. */
const ALA_ICONS: Record<string, ComponentType> = {
  "Humanistiset alat": OpenBook,
  Kasvatusalat: GraduationCap,
  "Kauppa, hallinto ja oikeustieteet": Bank,
  Luonnontieteet: Atom,
  Lääketieteet: Hospital,
  "Maa- ja metsätalousalat": Tree,
  Palvelualat: Cutlery,
  "Taiteet ja kulttuurialat": Palette,
  "Tekniikan alat": Settings,
  "Terveys- ja hyvinvointialat": Heart,
  "Tietojenkäsittely ja tietoliikenne": Code,
  "Yhteiskunnalliset alat": Globe,
};

export function alaIcon(alaName: string): ComponentType | undefined {
  return ALA_ICONS[alaName];
}
