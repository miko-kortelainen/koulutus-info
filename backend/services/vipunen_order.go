package services

import (
	"school-api/models"
	"sort"
)

func SortVipunenData(data []models.VipunenData, order Order) {
	sort.Slice(data, func(i, j int) bool {
		switch order {
		case OrderAsc:
			return (data)[i].Hakukohde < (data)[j].Hakukohde
		case OrderDesc:
			return (data)[i].Hakukohde > (data)[j].Hakukohde
		case OrderMostPopular:
			return (data)[i].KaikkiHakijatLkm > (data)[j].KaikkiHakijatLkm
		case OrderLeastPopular:
			return (data)[i].KaikkiHakijatLkm < (data)[j].KaikkiHakijatLkm
		case OrderMostSpots:
			return (data)[i].AloituspaikatLkm > (data)[j].AloituspaikatLkm
		case OrderLeastSpots:
			return (data)[i].AloituspaikatLkm < (data)[j].AloituspaikatLkm
		default:
			return (data)[i].Hakukohde < (data)[j].Hakukohde
		}
	})
}
