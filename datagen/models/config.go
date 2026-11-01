package models

type Config struct {
	Vipunen     VipunenConfig     `json:"vipunen"`
	Opintopolku OpintopolkuConfig `json:"opintopolku"`
}

type VipunenConfig struct {
	AineistoURL  string `json:"aineistoUrl"`
	TilastoVuosi int    `json:"tilastoVuosi"`
	Hakutapa     string `json:"hakutapa"`
}

type OpintopolkuConfig struct {
	Haut              []OpintopolkuHaku `json:"haut"`
	Alkamisajankohdat []string          `json:"alkamisajankohdat"`
}

type OpintopolkuHaku struct {
	ID  string `json:"id"`
	OID string `json:"oid"`
}
