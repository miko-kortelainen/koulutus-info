package services

import (
	"fmt"
	"net/url"
)

const toinenAsteURL = "https://api.vipunen.fi/api/resources/perusopetuksen_jalkeinen_koulutus_hakeneet_ja_paikan_vastaanottaneet/data"

type ToinenAsteRow struct {
	Haku                    string `json:"haku,omitempty"`
	KooditHakukohde         string `json:"kooditHakukohde"`
	KooditTutkintoHakukohde string `json:"kooditTutkintoHakukohde"`
	Hakukohde               string `json:"hakukohde"`
	Oppilaitos              string `json:"oppilaitos"`
	KuntaHakukohde          string `json:"kuntaHakukohde"`
	KoulutusasteTaso2       string `json:"koulutusasteTaso2"`
	KoulutusalaTaso1        string `json:"koulutusalaTaso1"`
	KoulutuksenKieli        string `json:"koulutuksenKieli"`
	AloituspaikatLkm        int    `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm        int    `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm  int    `json:"ensisijaisetHakijatLkm"`
	ValitutLkm              int    `json:"valitutLkm"`
}

func FilterToinenAste(rows []ToinenAsteRow) ([]ToinenAsteRow, bool) {
	result := make([]ToinenAsteRow, 0, len(rows))
	hasApplicants := false
	for _, row := range rows {
		if row.Haku != "Perusopetuksen jälkeisen koulutuksen yhteishaku" && row.Haku != "Ammatillisen koulutuksen ja lukiokoulutuksen yhteishaku" {
			continue
		}
		if row.KooditHakukohde == "1.2.246.562.20.00000000000000087412" || row.KooditHakukohde == "1.2.246.562.20.00000000000000083894" {
			continue
		}
		if row.KaikkiHakijatLkm > 0 {
			hasApplicants = true
		}
		row.Haku = ""
		result = append(result, row)
	}
	return result, hasApplicants
}

// FetchToinenAste retrieves and filters second-degree joint-application statistics.
func FetchToinenAste(year int) ([]ToinenAsteRow, bool, error) {
	params := url.Values{"filter": {fmt.Sprintf("koulutuksenAlkamisvuosi=='%d'", year)}, "limit": {"100000"}}
	var rows []ToinenAsteRow
	if err := FetchJSON("Vipunen toinen aste", toinenAsteURL+"?"+params.Encode(), &rows); err != nil {
		return nil, false, err
	}
	if len(rows) >= 100000 {
		return nil, false, fmt.Errorf("Vipunen toinen aste returned too many rows")
	}
	data, hasApplicants := FilterToinenAste(rows)
	return data, hasApplicants, nil
}
