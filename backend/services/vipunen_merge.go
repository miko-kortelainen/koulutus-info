package services

import (
	"cmp"
	"school-api/models"
	"slices"
)

// MergeRecords collapses per-valintatapajono Vipunen rows into one record per
// hakukohde. Applicant counts are per selection queue and overlap (the same
// applicant is evaluated in multiple queues at once), so we take the max
// across queues rather than summing them. AloituspaikatLkm is always
// reported on a single row per hakukohde, so summing it is safe.
func MergeRecords(records []models.StatisticsEntry) []models.StatisticsEntry {
	grouped := make(map[string]*models.StatisticsEntry)

	for _, r := range records {
		m, exists := grouped[r.KooditHakukohde]
		if !exists {
			first := r
			first.ValintatapajononTyyppi = nil
			first.AlinHyvaksyttyPistemaara = nil
			first.YlinHyvaksyttyPistemaara = nil
			first.AloituspaikatLkm = 0
			first.KaikkiHakijatLkm = 0
			first.EnsisijaisetHakijatLkm = 0
			m = &first
			grouped[r.KooditHakukohde] = m
		}
		m.AloituspaikatLkm += r.AloituspaikatLkm
		m.KaikkiHakijatLkm = max(m.KaikkiHakijatLkm, r.KaikkiHakijatLkm)
		m.EnsisijaisetHakijatLkm = max(m.EnsisijaisetHakijatLkm, r.EnsisijaisetHakijatLkm)
	}

	result := make([]models.StatisticsEntry, 0, len(grouped))
	for _, v := range grouped {
		result = append(result, *v)
	}
	slices.SortFunc(result, func(a, b models.StatisticsEntry) int {
		if c := cmp.Compare(a.Hakukohde, b.Hakukohde); c != 0 {
			return c
		}
		return cmp.Compare(a.KooditHakukohde, b.KooditHakukohde)
	})
	return result
}
