package models

type VipunenData struct {
	KooditHakukohde        string  `json:"kooditHakukohde"`
	Hakukohde              string  `json:"hakukohde"`
	Korkeakoulu            string  `json:"korkeakoulu"`
	KoulutuksenKieli       string  `json:"koulutuksenKieli"`
	Sektori                string  `json:"sektori"`
	KoulutusAla            string  `json:"koulutusalaTaso1"`
	ValintatapajononTyyppi *string `json:"valintatapajononTyyppi,omitempty"`
	AloituspaikatLkm       int     `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm       int     `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm int     `json:"ensisijaisetHakijatLkm"`
}
