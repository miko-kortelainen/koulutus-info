package services

import "school-api/models"

// TransformVipunenData converts internal VipunenData records into the
// API-friendly StatisticsResponse used by /api/statistics.
func TransformVipunenData(data []models.VipunenData) models.StatisticsResponse {
	if len(data) == 0 {
		return models.StatisticsResponse{}
	}

	result := make(models.StatisticsResponse, 0, len(data))
	for _, d := range data {
		result = append(result, models.StatisticsEntry{
			KooditHakukohde:        d.KooditHakukohde,
			Hakukohde:              d.Hakukohde,
			Korkeakoulu:            d.Korkeakoulu,
			KoulutuksenKieli:       d.KoulutuksenKieli,
			Sektori:                d.Sektori,
			KoulutusAla:            d.KoulutusAla,
			AloituspaikatLkm:       d.AloituspaikatLkm,
			KaikkiHakijatLkm:       d.KaikkiHakijatLkm,
			EnsisijaisetHakijatLkm: d.EnsisijaisetHakijatLkm,
		})
	}

	return result
}
