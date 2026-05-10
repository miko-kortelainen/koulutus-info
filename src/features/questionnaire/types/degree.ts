export type DegreeData = {
  title: string;
  description: string;
  koulutuksenAlkamisvuosi: number;
  hakukohde: string;
  hakutapa: string;
  koulutusasteTaso2: string;
  paaasiallinenTutkintoHakukohde: string;
  koulutuksenKieli: string;
  maakuntaHakukohde: string;
  kuntaHakukohde: string;
  sektori: string;
  korkeakoulu: string;
  toimipiste: string;
  kooditPaaasiallinenTutkintoHakukohde: string;
  kooditHakukohde: string;
  aloituspaikatLkm: number;
  kaikkiHakijatLkm: number;
  ensisijaisetHakijatLkm: number;
  tietojoukkoPaivitettyPvm: string;
};

export type BasicDegreeData = {
  title: string;
  description: string;
  tags: string[];
  koulutus: string;
  koulut: string[];
};
