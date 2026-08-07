package models

// SchoolCatalogEntry is one institution row in schools.json.
// Name is the canonical join key shared with programmes, statistics, cutoffs, and palaute.
type SchoolCatalogEntry struct {
	Name      string `json:"name"`
	ShortName string `json:"shortName,omitempty"`
}

// SchoolCatalog is schools.json.
type SchoolCatalog []SchoolCatalogEntry
