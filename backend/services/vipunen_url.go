package services

import (
	"fmt"
	"net/url"
	"strings"
)

// Vipunen API filter parameters
const FilterHakutapa = "Yhteishaku"

// helper func for fiql query building
func eq(field, value string) string {
	return field + "=='" + value + "'"
}

// construct the Vipunen API URL from the filters.
func BuildVipunenURL(baseURL, tilastoVuosi string) (string, error) {
	if strings.TrimSpace(baseURL) == "" {
		return "", fmt.Errorf("aineistoUrl is required")
	}
	if strings.TrimSpace(tilastoVuosi) == "" {
		return "", fmt.Errorf("tilastoVuosi is required")
	}
	if _, err := url.ParseRequestURI(baseURL); err != nil {
		return "", fmt.Errorf("invalid aineistoUrl: %w", err)
	}

	filters := []string{
		eq("koulutuksenAlkamisvuosi", tilastoVuosi),
		eq("hakutapa", FilterHakutapa),
	}
	filter := url.QueryEscape(strings.Join(filters, " and "))
	return baseURL + "?filter=" + filter, nil
}
