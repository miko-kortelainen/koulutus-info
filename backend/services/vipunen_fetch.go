package services

import (
	"school-api/models"
)

func FetchVipunenData(apiURL string) ([]models.VipunenData, error) {
	var statistics []models.VipunenData

	if err := fetchJSON("vipunen", apiURL, &statistics); err != nil {
		return nil, err
	}

	return statistics, nil
}
