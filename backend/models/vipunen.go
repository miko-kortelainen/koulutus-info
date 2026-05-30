package models

type VipunenData struct {
	KooditHakukohde        string `json:"kooditHakukohde"`
	Hakukohde              string `json:"hakukohde"`
	Korkeakoulu            string `json:"korkeakoulu"`
	AloituspaikatLkm       *int   `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm       *int   `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm *int   `json:"ensisijaisetHakijatLkm"`
	KoulutuksenKieli       string `json:"koulutuksenKieli"`
	Sektori                string `json:"sektori"`
	KoulutusAla            string `json:"koulutusalaTaso1"`
}
