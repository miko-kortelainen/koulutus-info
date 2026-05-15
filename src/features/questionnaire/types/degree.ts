export type DegreeData = {
  koulutuksenAlkamisvuosi: number;
  koulutuksenAlkamiskausi: string;
  hakukohde: string;
  hakutapa: string;
  koulutusasteTaso1: string;
  koulutusasteTaso2: string;
  koulutusalaTaso1: string;
  koulutusalaTaso3: string;
  okmOhjauksenAla: string;
  paaasiallinenTutkintoHakukohde: string;
  koulutuksenKieli: string;
  maakuntaHakukohde: string;
  kuntaHakukohde: string;
  sektori: string;
  korkeakoulu: string;
  toimipiste: string;
  kooditHakukohde: string;
  aloituspaikatLkm: number;
  kaikkiHakijatLkm: number | null;
  ensisijaisetHakijatLkm: number | null;
  tietojoukkoPaivitettyPvm: string;
  opintopolku_toteutus_oid: string | null;
  opintopolku_koulutus_oid: string | null;
};

export type BasicDegreeData = {
  title: string;
  description: string;
  tags: string[];
  koulutus: string;
  koulut: string[];
};
