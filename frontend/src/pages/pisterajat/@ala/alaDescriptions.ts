/** Hand-edited SEO meta descriptions keyed by exact `koulutusala` from cutoff data. */
const ALA_META_DESCRIPTIONS: Record<string, (year: string) => string> = {
  "Humanistiset alat": (year) =>
    `Humanististen alojen yhteishaun pisterajat ${year}. Katso kielten, historian, filosofian ja tulkin pisterajat.`,
  Kasvatusalat: (year) =>
    `Kasvatusalojen yhteishaun pisterajat ${year}. Katso opettajan, varhaiskasvatuksen ja kasvatustieteen pisterajat.`,
  "Kauppa, hallinto ja oikeustieteet": (year) =>
    `Kaupan, hallinnon ja oikeustieteiden yhteishaun pisterajat ${year}. Katso tradenomin, oikeustieteen ja kauppatieteiden pisterajat.`,
  Luonnontieteet: (year) =>
    `Luonnontieteiden yhteishaun pisterajat ${year}. Katso biologian, fysiikan, kemian ja matematiikan pisterajat.`,
  Lääketieteet: (year) =>
    `Lääketieteet: katso vuoden ${year} yhteishaun hammaslääketieteen, ja lääkiksen pisterajat.`,
  "Maa- ja metsätalousalat": (year) =>
    `Maa- ja metsätalousalojen yhteishaun pisterajat ${year}. Katso agrologin, metsätalouden ja puutarha-alan pisterajat.`,
  Palvelualat: (year) =>
    `Palvelualojen yhteishaun pisterajat ${year}. Katso restonomin, matkailun, merenkulun ja liikunta-alan pisterajat.`,
  "Taiteet ja kulttuurialat": (year) =>
    `Taide- ja kulttuurialojen yhteishaun pisterajat ${year}. Katso medianomin, musiikin, artenomin ja kulttuurialan pisterajat.`,
  "Tekniikan alat": (year) =>
    `Tekniikan alojen yhteishaun pisterajat ${year}. Katso insinöörin, diplomi-insinöörin ja arkkitehtuurin pisterajat.`,
  "Terveys- ja hyvinvointialat": (year) =>
    `Terveys- ja hyvinvointialojen yhteishaun pisterajat ${year}. Katso terveystieteen, sosiaalialan ja farmaseutin pisterajat.`,
  "Tietojenkäsittely ja tietoliikenne": (year) =>
    `Tietojenkäsittelyn ja tietoliikenteen yhteishaun pisterajat ${year}. Katso insinöörin, tietotekniikan ja tietojenkäsittelyn pisterajat.`,
  "Yhteiskunnalliset alat": (year) =>
    `Yhteiskunnallisten alojen yhteishaun pisterajat ${year}. Katso sosiaalityön, politiikan ja psykologian pisterajat.`,
};

export function alaMetaDescription(alaName: string, year: string): string {
  const build = ALA_META_DESCRIPTIONS[alaName];
  if (!build) {
    throw new Error(`Missing SEO description for koulutusala "${alaName}" — add it to alaDescriptions.ts`);
  }
  return build(year);
}
