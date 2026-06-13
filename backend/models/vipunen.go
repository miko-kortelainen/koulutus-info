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

// --- Optimized output format for /api/statistics ---

// StatisticsResponse is the optimized response for /api/statistics:
// a flat array of statistics entries with the fields we expose to the API.
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
