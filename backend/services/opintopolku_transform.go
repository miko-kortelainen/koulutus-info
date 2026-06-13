package services

import "school-api/models"

// converts the raw Opintopolku data into the
// optimized /api/schools response format: a flat array of koulutus entries,
func TransformOpintopolkuData(data *models.OpintopolkuData) models.SchoolsResponse {
	if data == nil {
		return models.SchoolsResponse{}
	}

	result := make(models.SchoolsResponse, 0, len(data.Hits))

	for _, school := range data.Hits {
		nimi := models.LocalizedName{}
		if len(school.Koulutukset) > 0 {
			nimi = toLocalizedName(school.Koulutukset[0].Nimi)
		}

		toteutukset := make([]models.ToteutusEntry, 0, len(school.Toteutukset))
		for _, t := range school.Toteutukset {
			toteutukset = append(toteutukset, models.ToteutusEntry{
				ToteutusOid:    t.ToteutusOid,
				ToteutusNimi:   toLocalizedName(t.ToteutusNimi),
				OppilaitosNimi: toLocalizedName(t.OppilaitosNimi),
			})
		}

		result = append(result, models.KoulutusEntry{
			Nimi:        nimi,
			Toteutukset: toteutukset,
		})
	}

	return result
}

// toLocalizedName keeps only the Finnish + English values.
func toLocalizedName(s models.LanguageStrings) models.LocalizedName {
	return models.LocalizedName{
		Fi: s.Fi,
		En: s.En,
	}
}
