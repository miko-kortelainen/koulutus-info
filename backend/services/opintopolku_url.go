package services

import (
	"fmt"
	"net/url"
	"strings"
)

// Opintopolku API query parameters
const (
	OpintopolkuBaseURL = "https://opintopolku.fi/konfo-backend/external/search/koulutukset"
)

// construct the Opintopolku API URL from the parameters.
func BuildOpintopolkuURL(yhteishakuOID string, alkamisajankohdat []string) (string, string, error) {
	u, _ := url.Parse(OpintopolkuBaseURL)
	query := url.Values{
		"size":               {"100"},
		"lng":                {"fi"},
	}

	trimmedOID := strings.TrimSpace(yhteishakuOID)
	selection := ""
	if trimmedOID != "" {
		query.Set("yhteishaku", trimmedOID)
		selection = "yhteishakuOid=" + trimmedOID
	} else if len(alkamisajankohdat) > 0 {
		terms := strings.Join(alkamisajankohdat, ",")
		query.Set("alkamiskausi", terms)
		selection = "alkamisajankohdat=" + terms
	} else {
		return "", "", fmt.Errorf("yhteishakuOid or alkamisajankohdat is required")
	}

	u.RawQuery = query.Encode()
	return u.String(), selection, nil
}
