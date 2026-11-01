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

	year := strconv.Itoa(cfg.TilastoVuosi)
	startsDuringYear := fmt.Sprintf(
		"(%s and (%s or %s))",
		eq("koulutuksenAlkamisvuosi", year),
		eq("koulutuksenAlkamiskausi", "Syksy"),
		eq("koulutuksenAlkamiskausi", "Kevät"),
	)

	filters := []string{startsDuringYear}
	if cfg.Hakutapa != "" {
		filters = append(filters, eq("hakutapa", cfg.Hakutapa))
	}
	filter := url.QueryEscape(strings.Join(filters, " and "))
	return cfg.AineistoURL + "?filter=" + filter, nil
}
