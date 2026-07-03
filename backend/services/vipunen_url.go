package services

import (
	"fmt"
	"net/url"
	"school-api/models"
	"strconv"
	"strings"
)

// helper func for fiql query building
func eq(field, value string) string {
	return field + "=='" + value + "'"
}

// construct the Vipunen API URL from the filters.
func BuildVipunenURL(cfg models.VipunenConfig) (string, error) {
	if strings.TrimSpace(cfg.AineistoURL) == "" {
		return "", fmt.Errorf("aineistoUrl is required")
	}
	if _, err := url.ParseRequestURI(cfg.AineistoURL); err != nil {
		return "", fmt.Errorf("invalid aineistoUrl: %w", err)
	}
	if cfg.TilastoVuosi < 1000 || cfg.TilastoVuosi > 9999 {
		return "", fmt.Errorf("tilastoVuosi must be a four-digit year")
	}

	// tilastoVuosi is the yhteishaku year: the spring haut lead to programs
	// starting autumn that year, the autumn haku to programs starting spring
	// the following year.
	hakuVuodenAloitukset := fmt.Sprintf(
		"((%s and %s) or (%s and %s))",
		eq("koulutuksenAlkamisvuosi", strconv.Itoa(cfg.TilastoVuosi)),
		eq("koulutuksenAlkamiskausi", "Syksy"),
		eq("koulutuksenAlkamisvuosi", strconv.Itoa(cfg.TilastoVuosi+1)),
		eq("koulutuksenAlkamiskausi", "Kevät"),
	)

	filters := []string{hakuVuodenAloitukset}
	if cfg.Hakutapa != "" {
		filters = append(filters, eq("hakutapa", cfg.Hakutapa))
	}
	if cfg.EiKoulutuksenKieli != "" {
		filters = append(filters, "koulutuksenKieli!='"+cfg.EiKoulutuksenKieli+"'")
	}
	filter := url.QueryEscape(strings.Join(filters, " and "))
	return cfg.AineistoURL + "?filter=" + filter, nil
}
