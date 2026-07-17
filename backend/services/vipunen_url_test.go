package services

import (
	"net/url"
	"school-api/models"
	"strings"
	"testing"
)

func TestBuildVipunenURLIncludesBothStartSeasonsAndAllLanguages(t *testing.T) {
	got, err := BuildVipunenURL(models.VipunenConfig{
		AineistoURL:  "https://example.com/data",
		TilastoVuosi: 2026,
		Hakutapa:     "Yhteishaku",
	})
	if err != nil {
		t.Fatalf("BuildVipunenURL() error = %v", err)
	}

	parsed, err := url.Parse(got)
	if err != nil {
		t.Fatal(err)
	}
	filter := parsed.Query().Get("filter")
	for _, want := range []string{
		"koulutuksenAlkamisvuosi=='2026'",
		"koulutuksenAlkamiskausi=='Kevät'",
		"koulutuksenAlkamiskausi=='Syksy'",
		"hakutapa=='Yhteishaku'",
	} {
		if !strings.Contains(filter, want) {
			t.Errorf("filter %q does not contain %q", filter, want)
		}
	}
	if strings.Contains(filter, "koulutuksenKieli") {
		t.Errorf("filter %q unexpectedly filters languages", filter)
	}
}
