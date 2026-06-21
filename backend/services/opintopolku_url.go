package services

import (
	"fmt"
	"net/url"
	"strings"
)

// Opintopolku API query parameters
const (
	OpintopolkuBaseURL = "https://opintopolku.fi/konfo-backend/external/search/koulutukset"

	OpintopolkuParamKoulutustyyppi = "amk-alempi,kandi-ja-maisteri"
	OpintopokuParamValintatapa     = "valintatapajono_kp,valintatapajono_tv,valintatapajono_yp"
)

// construct the Opintopolku API URL from the parameters.
func BuildOpintopolkuURL(yhteishakuOID string, alkamisajankohdat []string) (string, string, error) {
	u, _ := url.Parse(OpintopolkuBaseURL)
	query := url.Values{
		"hakutapa":           {"hakutapa_01"},
		"size":               {"100"},
		"lng":                {"fi"},
		"opetustapa":         {"opetuspaikkakk_1,opetuspaikkakk_2,opetuspaikkakk_3,opetuspaikkakk_4"},
		"maksullisuustyyppi": {"maksuton"},
		"koulutustyyppi":     {OpintopolkuParamKoulutustyyppi},
		"valintatapa":        {OpintopokuParamValintatapa},
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
