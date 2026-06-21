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

// --- Optimized output format for schools.json ---

// SchoolsResponse is the optimized schools.json format:
// a flat array of koulutus entries, each with its name (fi + en) and toteutukset.
type SchoolsResponse []KoulutusEntry

type KoulutusEntry struct {
	Nimi        LocalizedName   `json:"nimi"`
	Toteutukset []ToteutusEntry `json:"toteutukset"`
}

type ToteutusEntry struct {
	ToteutusOid    string        `json:"toteutusOid"`
	ToteutusNimi   LocalizedName `json:"toteutusNimi"`
	OppilaitosNimi LocalizedName `json:"oppilaitosNimi"`
}

// LocalizedName only carries Finnish + English names.
type LocalizedName struct {
	Fi string `json:"fi,omitempty"`
	En string `json:"en,omitempty"`
	Sv string `json:"sv,omitempty"`
}
