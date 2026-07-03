package models

// StatisticsResponse is the statistics.json format.
type StatisticsResponse []StatisticsEntry

// StatisticsEntry is both the Vipunen API row shape and the statistics.json
// output shape; MergeRecords collapses rows in between.
type StatisticsEntry struct {
	KooditHakukohde        string  `json:"kooditHakukohde"`
	Hakukohde              string  `json:"hakukohde"`
	Korkeakoulu            string  `json:"korkeakoulu,omitempty"`
	KoulutuksenKieli       string  `json:"koulutuksenKieli,omitempty"`
	Sektori                string  `json:"sektori,omitempty"`
	KoulutusAla            string  `json:"koulutusalaTaso1,omitempty"`
	ValintatapajononTyyppi *string `json:"valintatapajononTyyppi,omitempty"`
	AloituspaikatLkm           int      `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm           int      `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm     int      `json:"ensisijaisetHakijatLkm"`
	AlinHyvaksyttyPistemaara   *float64 `json:"alinHyvaksyttyPistemaara,omitempty"`
	YlinHyvaksyttyPistemaara   *float64 `json:"ylinHyvaksyttyPistemaara,omitempty"`
}
