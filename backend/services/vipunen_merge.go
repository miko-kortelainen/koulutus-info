package services

import (
	"school-api/models"
	"sort"
)

func addIfNotNil(sum *int, val *int) {
	if val != nil {
		*sum += *val
	}
}

func MergeRecords(records []models.VipunenData) []models.VipunenData {
	type accumulator struct {
		merged models.VipunenData
	}

	grouped := make(map[string]*models.VipunenData)

	order := []string{}

	for _, r := range records {
		key := r.KooditHakukohde

		if _, exists := grouped[key]; !exists {
			grouped[key] = &models.VipunenData{
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
		addIfNotNil(&m.AloituspaikatLkm, &r.AloituspaikatLkm)
		addIfNotNil(&m.KaikkiHakijatLkm, &r.KaikkiHakijatLkm)
		addIfNotNil(&m.EnsisijaisetHakijatLkm, &r.EnsisijaisetHakijatLkm)
	}

	result := make([]models.VipunenData, 0, len(order))
	for _, key := range order {
		result = append(result, *grouped[key])
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].Hakukohde < result[j].Hakukohde
	})

	return result
}
