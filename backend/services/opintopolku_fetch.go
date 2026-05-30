package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"school-api/models"
	"strconv"
	"time"
)

func FetchOpintopolkuData(apiURL string) (*models.OpintopolkuData, error) {
	u, err := url.Parse(apiURL)
	if err != nil {
		return nil, fmt.Errorf("invalid base URL: %w", err)
	}

	q := u.Query()

	var allHits []models.School
	page := 1
	var totalExpected int

	for {
		fmt.Printf("fetching page: %d\n", page)

		q.Set("page", strconv.Itoa(page))
		u.RawQuery = q.Encode()
		reqURL := u.String()

		apiResp, err := fetchOpintopolkuPage(reqURL)
		if err != nil {
			return nil, fmt.Errorf("error processing page %d: %w", page, err)
		}

		if page == 1 {
			totalExpected = apiResp.Total
		}

		if len(apiResp.Hits) == 0 {
			break
		}

		allHits = append(allHits, apiResp.Hits...)

		if len(apiResp.Hits) < 100 {
			break
		}

		page++
		time.Sleep(1 * time.Second)
	}

	return &models.OpintopolkuData{
		Total: totalExpected,
		Hits:  allHits,
	}, nil
}

func fetchOpintopolkuPage(reqURL string) (*models.OpintopolkuData, error) {
	resp, err := http.Get(reqURL)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch from opintopolku: %w", err)
	}
	defer resp.Body.Close()

	var apiResp models.OpintopolkuData
	err = json.NewDecoder(resp.Body).Decode(&apiResp)
	if err != nil {
		return nil, fmt.Errorf("failed to decode JSON: %w", err)
	}

	return &apiResp, nil
}
