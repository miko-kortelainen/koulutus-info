package models

type OpintopolkuData struct {
	Total int      `json:"total"`
	Hits  []School `json:"hits"`
}

type School struct {
	Koulutukset    []Koulutus `json:"koulutukset"`
	Toteutukset    []Toteutus `json:"toteutukset"`
	Koulutustyyppi string     `json:"koulutustyyppi"`
}

type Toteutus struct {
	ToteutusOid    string          `json:"toteutusOid"`
	ToteutusNimi   LanguageStrings `json:"toteutusNimi"`
	OppilaitosNimi LanguageStrings `json:"oppilaitosNimi"`
	Kunnat         []Kunta         `json:"kunnat"`
}

type Kunta struct {
	Nimi LanguageStrings `json:"nimi"`
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
	Nimi           LanguageStrings `json:"nimi"`
	Koulutustyyppi string          `json:"koulutustyyppi"`
	Toteutukset    []ToteutusEntry `json:"toteutukset"`
}

type ToteutusEntry struct {
	ToteutusOid    string            `json:"toteutusOid"`
	ToteutusNimi   LanguageStrings   `json:"toteutusNimi"`
	OppilaitosNimi LanguageStrings `json:"oppilaitosNimi"`
	Kunnat         []string        `json:"kunnat"`
}
