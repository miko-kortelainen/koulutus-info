package services

import "school-api/models"

type MergedRecord struct {
	KooditHakukohde        string `json:"kooditHakukohde"`
	Hakukohde              string `json:"hakukohde"`
	Korkeakoulu            string `json:"korkeakoulu"`
	AloituspaikatLkm       int    `json:"aloituspaikatLkm"`
	KaikkiHakijatLkm       int    `json:"kaikkiHakijatLkm"`
	EnsisijaisetHakijatLkm int    `json:"ensisijaisetHakijatLkm"`
	KoulutuksenKieli       string `json:"koulutuksenKieli"`
	Sektori                string `json:"sektori"`
	KoulutusAla            string `json:"koulutusalaTaso1"`
}

func addIfNotNil(sum *int, val *int) {
	if val != nil {
		*sum += *val
	}
}

func MergeRecords(records []models.VipunenData) []MergedRecord {
	type accumulator struct {
		merged MergedRecord
	}

	grouped := make(map[string]*MergedRecord)

	order := []string{}

	for _, r := range records {
		key := r.KooditHakukohde

		if _, exists := grouped[key]; !exists {
			grouped[key] = &MergedRecord{
				KooditHakukohde:  r.KooditHakukohde,
				Hakukohde:        r.Hakukohde,
				Korkeakoulu:      r.Korkeakoulu,
				KoulutuksenKieli: r.KoulutuksenKieli,
				Sektori:          r.Sektori,
				KoulutusAla:      r.KoulutusAla,
			}
			order = append(order, key)
		}

		m := grouped[key]
		addIfNotNil(&m.AloituspaikatLkm, r.AloituspaikatLkm)
		addIfNotNil(&m.KaikkiHakijatLkm, r.KaikkiHakijatLkm)
		addIfNotNil(&m.EnsisijaisetHakijatLkm, r.EnsisijaisetHakijatLkm)
	}

	result := make([]MergedRecord, 0, len(order))
	for _, key := range order {
		result = append(result, *grouped[key])
	}
	return result
}
