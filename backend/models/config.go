package models

type Config struct {
	Vipunen     VipunenConfig     `json:"vipunen"`
	Opintopolku OpintopolkuConfig `json:"opintopolku"`
}

type VipunenConfig struct {
	AineistoURL  string `json:"aineistoUrl"`
	TilastoVuosi string `json:"tilastoVuosi"`
}

type OpintopolkuConfig struct {
	YhteishakuOID     string   `json:"yhteishakuOid"`
	Alkamisajankohdat []string `json:"alkamisajankohdat"`
}
