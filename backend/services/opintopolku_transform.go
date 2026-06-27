package services

import "school-api/models"

// TransformOpintopolkuData converts raw Opintopolku data into the optimized
// schools.json format: a flat array of koulutus entries.
func TransformOpintopolkuData(data *models.OpintopolkuData) models.SchoolsResponse {
	if data == nil {
		return models.SchoolsResponse{}
	}

	result := make(models.SchoolsResponse, 0, len(data.Hits))

	for _, school := range data.Hits {
		nimi := models.LanguageStrings{}
		if len(school.Koulutukset) > 0 {
			nimi = school.Koulutukset[0].Nimi
		}

		toteutukset := make([]models.ToteutusEntry, 0, len(school.Toteutukset))
		for _, t := range school.Toteutukset {
			toteutukset = append(toteutukset, models.ToteutusEntry{
				ToteutusOid:    t.ToteutusOid,
				ToteutusNimi:   t.ToteutusNimi,
				OppilaitosNimi: t.OppilaitosNimi,
			})
		}

		result = append(result, models.KoulutusEntry{
			Nimi:        nimi,
			Toteutukset: toteutukset,
		})
	}

	return result
}

