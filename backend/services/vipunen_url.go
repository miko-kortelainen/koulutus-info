package services

import (
	"net/url"
	"strings"
)

// Vipunen API filter parameters
const (
	VipunenBaseURL = "https://api.vipunen.fi/api/resources/korkeakoulutus_hakeneet_ja_paikan_vastaanottaneet/data"

	FilterKoulutuksenAlkamisvuosi = "2026"
	FilterHakutapa                = "Yhteishaku"
	FilterKoulutusasteTaso1       = "Alempi korkeakouluaste"
)

// helper func for fiql query building
func eq(field, value string) string {
	return field + "=='" + value + "'"
}

// construct the Vipunen API URL from the filters.
func buildVipunenURL() string {
	filters := []string{
		eq("koulutuksenAlkamisvuosi", FilterKoulutuksenAlkamisvuosi),
		eq("hakutapa", FilterHakutapa),
		eq("koulutusasteTaso1", FilterKoulutusasteTaso1),
	}
	filter := url.QueryEscape(strings.Join(filters, " and "))
	return VipunenBaseURL + "?filter=" + filter
}
