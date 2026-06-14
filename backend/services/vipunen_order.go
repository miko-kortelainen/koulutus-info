package services

import (
	"cmp"
	"school-api/models"
	"slices"
)

func SortVipunenData(data []models.VipunenData, order Order) {
	slices.SortStableFunc(data, func(a, b models.VipunenData) int {
		switch order {
		case OrderAsc:
			return cmp.Compare(a.Hakukohde, b.Hakukohde)
		case OrderDesc:
			return cmp.Compare(b.Hakukohde, a.Hakukohde)
		case OrderMostPopular:
			return cmp.Compare(b.KaikkiHakijatLkm, a.KaikkiHakijatLkm)
		case OrderLeastPopular:
			return cmp.Compare(a.KaikkiHakijatLkm, b.KaikkiHakijatLkm)
		case OrderMostSpots:
			return cmp.Compare(b.AloituspaikatLkm, a.AloituspaikatLkm)
		case OrderLeastSpots:
			return cmp.Compare(a.AloituspaikatLkm, b.AloituspaikatLkm)
		default:
			return cmp.Compare(a.Hakukohde, b.Hakukohde)
		}
	})
}
