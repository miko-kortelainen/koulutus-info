package services

import (
	"strings"

	"school-api/models"
)

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
			kunnat := make([]string, 0, len(t.Kunnat))
			for _, k := range t.Kunnat {
				kunnat = append(kunnat, k.Nimi.Fi)
			}
			toteutusNimi := strings.ToLower(t.ToteutusNimi.Fi + " " + t.ToteutusNimi.Sv + " " + t.ToteutusNimi.En)
			toteutukset = append(toteutukset, models.ToteutusEntry{
				ToteutusOid:    t.ToteutusOid,
				ToteutusNimi:   t.ToteutusNimi,
				OppilaitosNimi: t.OppilaitosNimi,
				Kunnat:         kunnat,
				Muuntokoulutus: strings.Contains(toteutusNimi, "muunto"),
			})
		}

		result = append(result, models.KoulutusEntry{
			Nimi:         nimi,
			Sektori:      school.Koulutustyyppi,
			Tutkintotaso: classifyTutkintotaso(school, nimi),
			Toteutukset:  toteutukset,
		})
	}

	return result
}

// classifyTutkintotaso decides "alempi" vs "ylempi" for one search hit. The
// Opintopolku API exposes no structured field for this, so it reads the degree
// classification name (koulutukset[0]) with the hit name and credit count as
// fallbacks.
func classifyTutkintotaso(school models.School, koulutusNimi models.LanguageStrings) string {
	koulutus := strings.ToLower(koulutusNimi.Fi + " " + koulutusNimi.En)
	hit := strings.ToLower(school.Nimi.Fi + " " + school.Nimi.En)

	if school.Koulutustyyppi == "yo" {
		// Maisteri-only admission; kandidaatti+maisteri programmes carry a
		// kandidaatti degree name and stay alempi.
		if strings.Contains(koulutus, "maist") || strings.Contains(koulutus, "master") {
			return "ylempi"
		}
		return "alempi"
	}

	if strings.Contains(koulutus, "ylempi") || strings.Contains(koulutus, "jatkotutkinto") ||
		strings.Contains(hit, "ylempi") {
		return "ylempi"
	}
	// Some hits are mislabeled in Opintopolku itself (e.g. a 90 op YAMK with a
	// bachelor koulutuskoodi). Alempi AMK degrees are always >= 210 op, so a
	// small laajuus means ylempi — unless it is a muuntokoulutus, which is
	// also short.
	if la := school.OpintojenLaajuusNumero; la > 0 && la <= 90 && !strings.Contains(hit, "muunto") {
		return "ylempi"
	}
	return "alempi"
}
