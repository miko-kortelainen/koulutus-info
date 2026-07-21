package services

import (
	"school-api/models"
	"testing"
)

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
			ValitutLkm:             25,
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
			ValitutLkm:             15,
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
	if got.AloituspaikatLkm != 20 || got.KaikkiHakijatLkm != 180 || got.EnsisijaisetHakijatLkm != 70 || got.ValitutLkm != 40 {
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
