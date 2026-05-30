package models

type OpintopolkuData struct {
	Total int      `json:"total"`
	Hits  []School `json:"hits"`
}

type School struct {
	Koulutukset []Koulutus `json:"koulutukset"`
	Toteutukset []Toteutus `json:"toteutukset"`
}

type Toteutus struct {
	ToteutusOid    string          `json:"toteutusOid"`
	ToteutusNimi   LanguageStrings `json:"toteutusNimi"`
	OppilaitosNimi LanguageStrings `json:"oppilaitosNimi"`
}

type Koulutus struct {
	Nimi LanguageStrings `json:"nimi"`
}

type LanguageStrings struct {
	Fi string `json:"fi,omitempty"`
	Sv string `json:"sv,omitempty"`
	En string `json:"en,omitempty"`
}
