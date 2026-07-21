package services

import (
	"cmp"
	"fmt"
	"school-api/models"
	"slices"
)

type VipunenRow struct {
	models.StatisticsEntry
	KoulutuksenAlkamisvuosi int    `json:"koulutuksenAlkamisvuosi"`
	KoulutuksenAlkamiskausi string `json:"koulutuksenAlkamiskausi"`
}

func GroupStatisticsByRound(records []VipunenRow) (map[string][]models.StatisticsEntry, error) {
	grouped := make(map[string][]models.StatisticsEntry)
	for _, record := range records {
		var round string
		switch record.KoulutuksenAlkamiskausi {
		case "Syksy":
			round = fmt.Sprintf("%d_kevat", record.KoulutuksenAlkamisvuosi)
		case "Kevät":
			round = fmt.Sprintf("%d_syksy", record.KoulutuksenAlkamisvuosi-1)
		default:
			return nil, fmt.Errorf("unsupported start season %q", record.KoulutuksenAlkamiskausi)
		}
		grouped[round] = append(grouped[round], record.StatisticsEntry)
	}
	return grouped, nil
}

// MergeRecords collapses per-valintatapajono Vipunen rows into one record per
// hakukohde. Applicant counts are split across selection queue rows, while
// aloituspaikat are reported on a separate row.
func MergeRecords(records []models.StatisticsEntry) []models.StatisticsEntry {
	grouped := make(map[string]*models.StatisticsEntry)

	for _, r := range records {
		m, exists := grouped[r.KooditHakukohde]
		if !exists {
			first := r
			first.AloituspaikatLkm = 0
			first.KaikkiHakijatLkm = 0
			first.EnsisijaisetHakijatLkm = 0
			first.ValitutLkm = 0
			m = &first
			grouped[r.KooditHakukohde] = m
		}
		m.AloituspaikatLkm += r.AloituspaikatLkm
		m.KaikkiHakijatLkm += r.KaikkiHakijatLkm
		m.EnsisijaisetHakijatLkm += r.EnsisijaisetHakijatLkm
		m.ValitutLkm += r.ValitutLkm
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
