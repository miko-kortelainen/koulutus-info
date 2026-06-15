package services

import (
	"net/url"
)

// Opintopolku API query parameters
const (
	OpintopolkuBaseURL = "https://opintopolku.fi/konfo-backend/external/search/koulutukset"

	OpintopolkuParamKoulutustyyppi = "amk-alempi,kandi-ja-maisteri"
	OpintopolkuParamAlkamiskausi   = "2026-kevat,2026-syksy"
	OpintopokuParamValintatapa     = "valintatapajono_kp,valintatapajono_tv,valintatapajono_yp"
)

// construct the Opintopolku API URL from the parameters.
func buildOpintopolkuURL() string {
	u, _ := url.Parse(OpintopolkuBaseURL)
	u.RawQuery = url.Values{
		"hakutapa":           {"hakutapa_01"},
		"size":               {"100"},
		"lng":                {"fi"},
		"opetustapa":         {"opetuspaikkakk_1,opetuspaikkakk_2,opetuspaikkakk_3,opetuspaikkakk_4"},
		"maksullisuustyyppi": {"maksuton"},
		"koulutustyyppi":     {OpintopolkuParamKoulutustyyppi},
		"alkamiskausi":       {OpintopolkuParamAlkamiskausi},
		"valintatapa":        {OpintopokuParamValintatapa},
	}.Encode()
	return u.String()
}
