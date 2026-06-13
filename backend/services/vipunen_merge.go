package services

import (
	"school-api/models"
	"sort"
)

var allowedValintatapajononTyypit = map[string]bool{
	"Koepisteet":      true,
	"Todistusvalinta": true,
	"Yhteispisteet":   true,
}

func addIfNotNil(sum *int, val *int) {
	if val != nil {
		*sum += *val
	}
}

func MergeRecords(records []models.VipunenData) []models.VipunenData {
	grouped := make(map[string]*models.VipunenData)
	// tracks which hakukohde groups have at least one allowed valintatapajononTyyppi
	keep := make(map[string]bool)

	for _, r := range records {
		key := r.KooditHakukohde
		m := groupFor(grouped, key, r)
		accumulate(m, r)
		if hasAllowedTyyppi(r) {
			keep[key] = true
		}
	}

	return collectKept(grouped, keep)
}

// returns the merged record for key, initializing it from r on first use.
func groupFor(grouped map[string]*models.VipunenData, key string, r models.VipunenData) *models.VipunenData {
	if m, exists := grouped[key]; exists {
		return m
	}

	first := r
	first.ValintatapajononTyyppi = nil
	first.AloituspaikatLkm = 0
	first.KaikkiHakijatLkm = 0
	first.EnsisijaisetHakijatLkm = 0
	grouped[key] = &first
	return &first
}

// adds r's countable values into the merged record m.
func accumulate(m *models.VipunenData, r models.VipunenData) {
	m.AloituspaikatLkm += r.AloituspaikatLkm
	m.KaikkiHakijatLkm += r.KaikkiHakijatLkm
	m.EnsisijaisetHakijatLkm += r.EnsisijaisetHakijatLkm
}

// reports whether r has an allowed valintatapajononTyyppi.
func hasAllowedTyyppi(r models.VipunenData) bool {
	return r.ValintatapajononTyyppi != nil && allowedValintatapajononTyypit[*r.ValintatapajononTyyppi]
}

// returns the kept groups sorted by hakukohde.
func collectKept(grouped map[string]*models.VipunenData, keep map[string]bool) []models.VipunenData {
	result := make([]models.VipunenData, 0, len(grouped))
	for key, v := range grouped {
		if keep[key] {
			result = append(result, *v)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].Hakukohde < result[j].Hakukohde
	})

	return result
}
