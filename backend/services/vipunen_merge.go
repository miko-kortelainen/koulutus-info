package services

import (
	"cmp"
	"school-api/models"
	"slices"
)

// MergeRecords collapses per-valintatapajono Vipunen rows into one record per
// hakukohde, summing counts and taking the first non-nil score bounds.
func MergeRecords(records []models.StatisticsEntry) []models.StatisticsEntry {
	grouped := make(map[string]*models.StatisticsEntry)

	for _, r := range records {
		m, exists := grouped[r.KooditHakukohde]
		if !exists {
			first := r
			first.ValintatapajononTyyppi = nil
			first.AloituspaikatLkm = 0
			first.KaikkiHakijatLkm = 0
			first.EnsisijaisetHakijatLkm = 0
			m = &first
			grouped[r.KooditHakukohde] = m
		}
		m.AloituspaikatLkm += r.AloituspaikatLkm
		m.KaikkiHakijatLkm += r.KaikkiHakijatLkm
		m.EnsisijaisetHakijatLkm += r.EnsisijaisetHakijatLkm
		if m.AlinHyvaksyttyPistemaara == nil {
			m.AlinHyvaksyttyPistemaara = r.AlinHyvaksyttyPistemaara
		}
		if m.YlinHyvaksyttyPistemaara == nil {
			m.YlinHyvaksyttyPistemaara = r.YlinHyvaksyttyPistemaara
		}
	}

	result := make([]models.StatisticsEntry, 0, len(grouped))
	for _, v := range grouped {
		result = append(result, *v)
	}
	slices.SortStableFunc(result, func(a, b models.StatisticsEntry) int {
		return cmp.Compare(a.Hakukohde, b.Hakukohde)
	})
	return result
}
