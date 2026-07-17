package services

import (
	"encoding/json"
	"os"
	"school-api/models"
	"testing"
)

func TestMergeRecords(t *testing.T) {
	data, err := os.ReadFile("testdata/vipunen_sample.json")
	if err != nil {
		t.Fatalf("failed to read test file: %v", err)
	}

	var records []models.StatisticsEntry
	if err := json.Unmarshal(data, &records); err != nil {
		t.Fatalf("failed to unmarshal test data %v", err)
	}

	merged := MergeRecords(records)

	if len(merged) == 0 {
		t.Fatalf("expected merged results, got none")
	}

	out, err := json.MarshalIndent(merged, "", "	")
	if err != nil {
		t.Fatalf("failed to marshal merged file: %v", err)
	}

	if err := os.WriteFile("testdata/vipunen_merged.json", out, 0644); err != nil {
		t.Fatalf("failed to write merged file %v", err)
	}

	t.Logf("wrote %d merged records", len(merged))
}

func TestMergeRecordsKeepsMetadataAndAggregatesCounts(t *testing.T) {
	records := []models.StatisticsEntry{
		{
			KooditHakukohde:        "hakukohde-1",
			Hakukohde:              "Testikoulutus",
			KoulutuksenKieli:       "vain englanti",
			KoulutusAste:           "Alempi korkeakouluaste",
			OKMOhjauksenAla:        "Tekniikan alat",
			Maakunta:               "Uusimaa",
			AloituspaikatLkm:       20,
			KaikkiHakijatLkm:       100,
			EnsisijaisetHakijatLkm: 30,
		},
		{
			KooditHakukohde:        "hakukohde-1",
			Hakukohde:              "Testikoulutus",
			KoulutuksenKieli:       "vain englanti",
			KoulutusAste:           "Alempi korkeakouluaste",
			OKMOhjauksenAla:        "Tekniikan alat",
			Maakunta:               "Uusimaa",
			KaikkiHakijatLkm:       80,
			EnsisijaisetHakijatLkm: 40,
		},
	}

	merged := MergeRecords(records)
	if len(merged) != 1 {
		t.Fatalf("len(MergeRecords()) = %d, want 1", len(merged))
	}

	got := merged[0]
	if got.KoulutuksenKieli != "vain englanti" ||
		got.KoulutusAste != "Alempi korkeakouluaste" ||
		got.OKMOhjauksenAla != "Tekniikan alat" ||
		got.Maakunta != "Uusimaa" {
		t.Fatalf("merged metadata = %#v", got)
	}
	if got.AloituspaikatLkm != 20 || got.KaikkiHakijatLkm != 180 || got.EnsisijaisetHakijatLkm != 70 {
		t.Fatalf("merged counts = %#v", got)
	}
}

func TestGroupStatisticsByRound(t *testing.T) {
	grouped, err := GroupStatisticsByRound([]VipunenRow{
		{
			StatisticsEntry:         models.StatisticsEntry{KooditHakukohde: "autumn-start"},
			KoulutuksenAlkamisvuosi: 2026,
			KoulutuksenAlkamiskausi: "Syksy",
		},
		{
			StatisticsEntry:         models.StatisticsEntry{KooditHakukohde: "spring-start"},
			KoulutuksenAlkamisvuosi: 2026,
			KoulutuksenAlkamiskausi: "Kevät",
		},
	})
	if err != nil {
		t.Fatalf("GroupStatisticsByRound() error = %v", err)
	}

	if grouped["2026_kevat"][0].KooditHakukohde != "autumn-start" {
		t.Fatalf("spring joint application = %#v", grouped["2026_kevat"])
	}
	if grouped["2025_syksy"][0].KooditHakukohde != "spring-start" {
		t.Fatalf("autumn joint application = %#v", grouped["2025_syksy"])
	}
}
