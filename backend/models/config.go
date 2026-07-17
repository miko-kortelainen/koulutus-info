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
	YhteishakuOID     string   `json:"yhteishakuOid"`
	Alkamisajankohdat []string `json:"alkamisajankohdat"`
}
