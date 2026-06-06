package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

var externalAPIClient = &http.Client{
	Timeout: 15 * time.Second,
}

func fetchJSON(apiName, reqURL string, target any) error {
	resp, err := externalAPIClient.Get(reqURL)
	if err != nil {
		return fmt.Errorf("failed to fetch from %s: %w", apiName, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return fmt.Errorf("%s returned %s", apiName, resp.Status)
	}

	if err := json.NewDecoder(resp.Body).Decode(target); err != nil {
		return fmt.Errorf("failed to decode %s JSON: %w", apiName, err)
	}

	return nil
}
