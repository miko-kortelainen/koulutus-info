package models

// StatisticsResponse is the statistics.json format.
type StatisticsResponse []StatisticsEntry

// StatisticsEntry is the merged statistics JSON shape.
type StatisticsEntry struct {
	KooditHakukohde        string `json:"kooditHakukohde"`
	Hakukohde              string `json:"hakukohde"`
	Korkeakoulu            string `json:"korkeakoulu,omitempty"`
	Kunta                  string `json:"kuntaHakukohde,omitempty"`
	Maakunta               string `json:"maakuntaHakukohde,omitempty"`
	KoulutuksenKieli       string `json:"koulutuksenKieli,omitempty"`
	Sektori                string `json:"sektori,omitempty"`
	KoulutusAste           string `json:"koulutusasteTaso1,omitempty"`
	KoulutusAla            string `json:"koulutusalaTaso1,omitempty"`
	OKMOhjauksenAla        string `json:"okmOhjauksenAla,omitempty"`
	AloituspaikatLkm       int    `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm       int    `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm int    `json:"ensisijaisetHakijatLkm"`
	ValitutLkm             int    `json:"valitutLkm"`
}
