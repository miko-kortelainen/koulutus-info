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
	grouped := make(map[string]*models.VipunenData)

	for _, r := range records {
		key := r.KooditHakukohde

		if _, exists := grouped[key]; !exists {
			first := r
			first.AloituspaikatLkm = 0
			first.KaikkiHakijatLkm = 0
			first.EnsisijaisetHakijatLkm = 0
			grouped[key] = &first
		}

		m := grouped[key]
		m.AloituspaikatLkm += r.AloituspaikatLkm
		m.KaikkiHakijatLkm += r.KaikkiHakijatLkm
		m.EnsisijaisetHakijatLkm += r.EnsisijaisetHakijatLkm
	}

	result := make([]models.VipunenData, 0, len(grouped))
	for _, v := range grouped {
		result = append(result, *v)
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].Hakukohde < result[j].Hakukohde
	})

	return result
}
