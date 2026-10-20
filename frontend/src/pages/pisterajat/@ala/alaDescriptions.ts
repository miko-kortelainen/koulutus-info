/** Hand-edited SEO meta descriptions keyed by exact `koulutusala` from cutoff data. */
const ALA_META_DESCRIPTIONS: Record<string, (year: string) => string> = {
  "Humanistiset alat": (year) =>
    `Humanististen alojen yhteishaun pisterajat ${year}. Katso kielten, historian, filosofian ja tulkin pisterajat.`,
  Kasvatusalat: (year) =>
    `Kasvatusalojen yhteishaun pisterajat ${year}. Katso luokanopettajan, varhaiskasvatuksen opettajan ja kasvatustieteen pisterajat.`,
  "Kauppa, hallinto ja oikeustieteet": (year) =>
    `Kaupan, hallinnon ja oikeustieteiden yhteishaun pisterajat ${year}. Katso tradenomin, kauppatieteiden, oikeustieteen ja hallintotieteiden pisterajat.`,
  Luonnontieteet: (year) =>
    `Luonnontieteiden yhteishaun pisterajat ${year}. Katso biologian, fysiikan, kemian, maantieteen ja matematiikan pisterajat.`,
  Lääketieteet: (year) =>
    `Lääketieteiden yhteishaun pisterajat ${year}. Katso lääketieteen, hammaslääketieteen, eläinlääketieteen ja lääkiksen pisterajat.`,
  "Maa- ja metsätalousalat": (year) =>
    `Maa- ja metsätalousalojen yhteishaun pisterajat ${year}. Katso agrologin, metsätalouden ja puutarha-alan pisterajat.`,
  Palvelualat: (year) =>
    `Palvelualojen yhteishaun pisterajat ${year}. Katso restonomin, matkailun, merenkulun ja liikunta-alan pisterajat.`,
  "Taiteet ja kulttuurialat": (year) =>
    `Taide- ja kulttuurialojen yhteishaun pisterajat ${year}. Katso medianomin, muotoilun, musiikin, artenomin ja kulttuurialan pisterajat.`,
  "Tekniikan alat": (year) =>
    `Tekniikan alojen yhteishaun pisterajat ${year}. Katso insinöörin, diplomi-insinöörin, tuotantotalouden ja arkkitehtuurin pisterajat.`,
  "Terveys- ja hyvinvointialat": (year) =>
    `Terveys- ja hyvinvointialojen yhteishaun pisterajat ${year}. Katso sairaanhoitajan, sosionomin, fysioterapeutin, ensihoitajan, terveydenhoitajan ja farmasian pisterajat.`,
  "Tietojenkäsittely ja tietoliikenne": (year) =>
    `Tietojenkäsittelyn ja tietoliikenteen yhteishaun pisterajat ${year}. Katso tietojenkäsittelytieteen, tietotekniikan ja insinöörin pisterajat.`,
  "Yhteiskunnalliset alat": (year) =>
    `Yhteiskunnallisten alojen yhteishaun pisterajat ${year}. Katso psykologian, sosiaalityön, valtiotieteiden ja yhteiskuntatieteiden pisterajat.`,
};

export function alaMetaDescription(alaName: string, year: string): string {
  const build = ALA_META_DESCRIPTIONS[alaName];
  if (!build) {
    throw new Error(`Missing SEO description for koulutusala "${alaName}" — add it to alaDescriptions.ts`);
  }
  return build(year);
}
