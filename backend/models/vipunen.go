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

// --- Optimized output format for statistics.json ---

// StatisticsResponse is the optimized statistics.json format.
type StatisticsResponse []StatisticsEntry

type StatisticsEntry struct {
	KooditHakukohde        string `json:"kooditHakukohde"`
	Hakukohde              string `json:"hakukohde"`
	Korkeakoulu            string `json:"korkeakoulu,omitempty"`
	KoulutuksenKieli       string `json:"koulutuksenKieli,omitempty"`
	Sektori                string `json:"sektori,omitempty"`
	KoulutusAla            string `json:"koulutusalaTaso1,omitempty"`
	AloituspaikatLkm       int    `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm       int    `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm int    `json:"ensisijaisetHakijatLkm"`
}
