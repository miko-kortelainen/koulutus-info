package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"school-api/models"
)

func FetchVipunenData(apiURL string) ([]models.VipunenData, error) {
	resp, err := http.Get(apiURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch from vipunen: %w", err)
	}

	defer resp.Body.Close()

	var statistics []models.VipunenData

	err = json.NewDecoder(resp.Body).Decode(&statistics)
	if err != nil {
		return nil, fmt.Errorf("failed to decode JSON: %w", err)
	}

	return statistics, nil
}
